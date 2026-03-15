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

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const getCmsOrigin = () => getEnv("CMS_SITE_URL") || "https://vegahukukistanbul.com";

const renderHandshakePage = (authorizeUrl: string) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>CMS Auth</title>
  </head>
  <body>
    <p>GitHub'a yonlendiriliyor...</p>
    <script>
      (function () {
        var authorizeUrl = ${JSON.stringify(authorizeUrl)};
        var targetOrigin = ${JSON.stringify(getCmsOrigin())};
        var started = false;

        function startAuth() {
          if (started) return;
          started = true;
          window.location.replace(authorizeUrl);
        }

        window.addEventListener("message", function (event) {
          if (event.origin === targetOrigin && event.data === "authorizing:github") {
            startAuth();
          }
        });

        if (window.opener) {
          window.opener.postMessage("authorizing:github", targetOrigin);
        }

        // 800ms sonra otomatik yönlendir (handshake beklemeden)
        window.setTimeout(startAuth, 800);
      })();
    </script>
  </body>
</html>`;

export async function GET(request: Request) {
  const clientId = getEnv("GITHUB_CLIENT_ID");

  if (!clientId) {
    return json({ ok: false, message: "GITHUB_CLIENT_ID tanimli degil." }, 500);
  }

  const state = crypto.randomUUID().replaceAll("-", "");
  const redirectUri = `${getCmsOrigin()}/api/cms/callback`;
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");

  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo");
  authorizeUrl.searchParams.set("state", state);

  const oauthContext = JSON.stringify({ state, origin: getCmsOrigin() });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const cookie = `cms_oauth_context=${encodeURIComponent(oauthContext)}; HttpOnly; Max-Age=600; Path=/; SameSite=Lax${secure}`;

  return html(renderHandshakePage(authorizeUrl.toString()), 200, {
    "set-cookie": cookie,
  });
}
