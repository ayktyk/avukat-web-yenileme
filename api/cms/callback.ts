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

const buildCookie = (name: string, value: string, maxAge: number) => {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${name}=${value}; HttpOnly; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
};

const readCookie = (request: Request, name: string) => {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const pair = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return pair ? decodeURIComponent(pair.split("=").slice(1).join("=")) : "";
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
        if (window.opener) {
          window.opener.postMessage(${JSON.stringify(message)}, ${JSON.stringify(targetOrigin)});
        }
        window.close();
      })();
    </script>
    <p>Bu pencereyi kapatabilirsiniz.</p>
  </body>
</html>`;

const renderError = (message: string, request: Request, status = 400) =>
  html(renderMessagePage(`authorization:github:error:${JSON.stringify({ message })}`, getOrigin(request)), status, {
    "set-cookie": buildCookie("cms_oauth_state", "", 0),
  });

export async function GET(request: Request) {
  const clientId = getEnv("GITHUB_CLIENT_ID");
  const clientSecret = getEnv("GITHUB_CLIENT_SECRET");
  const url = new URL(request.url);
  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";
  const storedState = readCookie(request, "cms_oauth_state");

  if (!clientId || !clientSecret) {
    return renderError("GitHub OAuth ayarları eksik.", request, 500);
  }

  if (!code || !state || !storedState || state !== storedState) {
    return renderError("GitHub doğrulama durumu eşleşmedi.", request, 400);
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
      redirect_uri: `${getOrigin(request)}/api/cms/callback`,
      state,
    }),
  });

  if (!response.ok) {
    return renderError("GitHub erişim anahtarı alınamadı.", request, 502);
  }

  const payload = (await response.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!payload.access_token) {
    return renderError(payload.error_description || payload.error || "GitHub erişim anahtarı alınamadı.", request, 502);
  }

  const successMessage = `authorization:github:success:${JSON.stringify({
    token: payload.access_token,
    provider: "github",
  })}`;

  return html(renderMessagePage(successMessage, getOrigin(request)), 200, {
    "set-cookie": buildCookie("cms_oauth_state", "", 0),
  });
}
