const getEnv = (key: string) => process.env[key]?.trim() ?? "";

const html = (content: string, status = 200, headers?: HeadersInit) =>
  new Response(content, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });

const getCmsOrigin = () => getEnv("CMS_SITE_URL") || "https://vegahukukistanbul.com";

const getAllowedOrigins = () => {
  const base = getCmsOrigin();
  const origins = new Set<string>([base]);

  if (base === "https://vegahukukistanbul.com") {
    origins.add("https://www.vegahukukistanbul.com");
  }
  if (base === "https://www.vegahukukistanbul.com") {
    origins.add("https://vegahukukistanbul.com");
  }

  return [...origins];
};

const buildCookie = (name: string, value: string, maxAge: number) => {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; HttpOnly; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
};

const readCookie = (request: Request, name: string) => {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const pair = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return pair ? decodeURIComponent(pair.split("=").slice(1).join("=")) : "";
};

const clearCookie = buildCookie("cms_oauth_context", "", 0);

const renderResultPage = (
  payload: string,
  isError: boolean,
  errorDetail?: string,
  authPayload?: Record<string, string>,
) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>CMS Auth</title>
    <style>
      body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f5f1ea; color: #1d2830; }
      .box { text-align: center; padding: 32px; }
      .error { color: #b91c1c; }
      .detail { margin-top: 12px; font-size: 13px; color: #6a7680; }
    </style>
  </head>
  <body>
    <div class="box">
      <p>${isError ? '<span class="error">Giris basarisiz.</span>' : 'Giris tamamlaniyor...'}</p>
      ${errorDetail ? `<p class="detail">${errorDetail}</p>` : ""}
      ${isError ? '<p class="detail"><a href="/admin/">Admin paneline don</a></p>' : ""}
    </div>
    <script>
      (function () {
        var payload = ${JSON.stringify(payload)};
        var origins = ${JSON.stringify(getAllowedOrigins())};
        var authPayload = ${JSON.stringify(authPayload ?? null)};

        function send() {
          if (window.opener) {
            origins.forEach(function (origin) {
              window.opener.postMessage(payload, origin);
              if (authPayload) {
                window.opener.postMessage(authPayload, origin);
              }
            });
            return true;
          }

          if (authPayload && authPayload.type === "vega-cms-auth" && authPayload.token) {
            try {
              window.localStorage.setItem(
                "decap-cms-user",
                JSON.stringify({
                  backendName: "github",
                  token: authPayload.token,
                  provider: authPayload.provider || "github",
                }),
              );
              window.location.replace("/admin/#/");
              return true;
            } catch (error) {
              console.error("Direct CMS auth bridge failed.", error);
            }
          }

          return false;
        }

        var attempts = 0;
        var timer = setInterval(function () {
          attempts++;
          send();
          if (attempts >= 10) {
            clearInterval(timer);
            if (!${JSON.stringify(isError)}) {
              setTimeout(function () { window.close(); }, 200);
            }
          }
        }, 150);
      })();
    </script>
  </body>
</html>`;

export async function GET(request: Request) {
  const clientId = getEnv("GITHUB_CLIENT_ID");
  const clientSecret = getEnv("GITHUB_CLIENT_SECRET");
  const url = new URL(request.url);
  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";

  if (!clientId || !clientSecret) {
    return html(
      renderResultPage(
        "authorization:github:error:{}",
        true,
        "GITHUB_CLIENT_ID veya GITHUB_CLIENT_SECRET tanimli degil.",
        { type: "vega-cms-auth-error", message: "GITHUB_CLIENT_ID veya GITHUB_CLIENT_SECRET tanimli degil." },
      ),
      500,
      { "set-cookie": clearCookie },
    );
  }

  if (!code) {
    return html(
      renderResultPage(
        "authorization:github:error:{}",
        true,
        "GitHub dogrulama kodu eksik.",
        { type: "vega-cms-auth-error", message: "GitHub dogrulama kodu eksik." },
      ),
      400,
      { "set-cookie": clearCookie },
    );
  }

  // State doğrulama: cookie varsa kontrol et, yoksa devam et (incognito uyumu)
  const rawCookie = readCookie(request, "cms_oauth_context");
  if (rawCookie) {
    try {
      const ctx = JSON.parse(rawCookie) as { state?: string };
      if (ctx.state && state && ctx.state !== state) {
        return html(
          renderResultPage(
            `authorization:github:error:${JSON.stringify({ message: "State eslesmedi." })}`,
            true,
            "Dogrulama durumu eslesmedi. Tekrar deneyin.",
            { type: "vega-cms-auth-error", message: "Dogrulama durumu eslesmedi. Tekrar deneyin." },
          ),
          400,
          { "set-cookie": clearCookie },
        );
      }
    } catch {
      // Cookie parse hatası — devam et
    }
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${getCmsOrigin()}/api/cms/callback`,
    }),
  });

  if (!response.ok) {
    return html(
      renderResultPage(
        `authorization:github:error:${JSON.stringify({ message: "Token alinamadi." })}`,
        true,
        `GitHub API yanit kodu: ${response.status}`,
        { type: "vega-cms-auth-error", message: `GitHub API yanit kodu: ${response.status}` },
      ),
      502,
      { "set-cookie": clearCookie },
    );
  }

  const data = (await response.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!data.access_token) {
    const msg = data.error_description || data.error || "Token alinamadi.";
    return html(
      renderResultPage(
        `authorization:github:error:${JSON.stringify({ message: msg })}`,
        true,
        msg,
        { type: "vega-cms-auth-error", message: msg },
      ),
      502,
      { "set-cookie": clearCookie },
    );
  }

  const successPayload = `authorization:github:success:${JSON.stringify({
    token: data.access_token,
    provider: "github",
  })}`;

  return html(
    renderResultPage(successPayload, false, undefined, {
      type: "vega-cms-auth",
      token: data.access_token,
      provider: "github",
    }),
    200,
    {
    "set-cookie": clearCookie,
    },
  );
}
