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

const getOrigin = (request: Request) => new URL(request.url).origin;
const getCmsOrigin = () => getEnv("CMS_SITE_URL") || "https://vegahukukistanbul.com";

const getAllowedOrigins = (targetOrigin: string) => {
  const origins = new Set<string>();

  if (targetOrigin) {
    origins.add(targetOrigin);
  }

  origins.add(getCmsOrigin());

  for (const origin of [...origins]) {
    if (origin === "https://vegahukukistanbul.com") {
      origins.add("https://www.vegahukukistanbul.com");
    }
    if (origin === "https://www.vegahukukistanbul.com") {
      origins.add("https://vegahukukistanbul.com");
    }
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

const readOauthContext = (request: Request) => {
  const raw = readCookie(request, "cms_oauth_context");
  if (!raw) {
    return { state: "", origin: getOrigin(request) };
  }

  try {
    const parsed = JSON.parse(raw) as { state?: string; origin?: string };
    return {
      state: typeof parsed.state === "string" ? parsed.state : "",
      origin: typeof parsed.origin === "string" ? parsed.origin : getOrigin(request),
    };
  } catch {
    return { state: "", origin: getOrigin(request) };
  }
};

const renderMessagePage = (message: string, targetOrigin: string) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>CMS Auth</title>
  </head>
  <body>
    <script>
      (function () {
        var payload = ${JSON.stringify(message)};
        var targetOrigins = ${JSON.stringify(getAllowedOrigins(targetOrigin))};

        if (window.opener) {
          var attempts = 0;
          var timer = window.setInterval(function () {
            attempts += 1;

            targetOrigins.forEach(function (origin) {
              window.opener.postMessage(payload, origin);
            });

            if (attempts >= 6) {
              window.clearInterval(timer);
              window.setTimeout(function () {
                window.close();
              }, 120);
            }
          }, 120);
        }
      })();
    </script>
    <p>Giris tamamlanıyor. Bu pencere kendiliginden kapanacaktır.</p>
  </body>
</html>`;

const clearCookie = buildCookie("cms_oauth_context", "", 0);

const renderError = (message: string, targetOrigin: string, status = 400) =>
  html(renderMessagePage(`authorization:github:error:${JSON.stringify({ message })}`, targetOrigin), status, {
    "set-cookie": clearCookie,
  });

export async function GET(request: Request) {
  const clientId = getEnv("GITHUB_CLIENT_ID");
  const clientSecret = getEnv("GITHUB_CLIENT_SECRET");
  const url = new URL(request.url);
  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";
  const oauthContext = readOauthContext(request);
  const targetOrigin = oauthContext.origin || getOrigin(request);

  if (!clientId || !clientSecret) {
    return renderError("GitHub OAuth ayarlari eksik.", targetOrigin, 500);
  }

  if (!code || !state || !oauthContext.state || state !== oauthContext.state) {
    return renderError("GitHub dogrulama durumu eslesmedi.", targetOrigin, 400);
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
      state,
    }),
  });

  if (!response.ok) {
    return renderError("GitHub erisim anahtari alinamadi.", targetOrigin, 502);
  }

  const payload = (await response.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!payload.access_token) {
    return renderError(payload.error_description || payload.error || "GitHub erisim anahtari alinamadi.", targetOrigin, 502);
  }

  const successMessage = `authorization:github:success:${JSON.stringify({
    token: payload.access_token,
    provider: "github",
  })}`;

  return html(renderMessagePage(successMessage, targetOrigin), 200, {
    "set-cookie": clearCookie,
  });
}
