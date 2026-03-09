const getEnv = (key: string) => process.env[key]?.trim() ?? "";

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const getOrigin = (request: Request) => new URL(request.url).origin;

const buildCookie = (name: string, value: string, maxAge: number) => {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${name}=${value}; HttpOnly; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
};

export async function GET(request: Request) {
  const clientId = getEnv("GITHUB_CLIENT_ID");

  if (!clientId) {
    return json({ ok: false, message: "GITHUB_CLIENT_ID tanımlı değil." }, 500);
  }

  const state = crypto.randomUUID().replaceAll("-", "");
  const redirectUri = `${getOrigin(request)}/api/cms/callback`;
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");

  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo");
  authorizeUrl.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      location: authorizeUrl.toString(),
      "set-cookie": buildCookie("cms_oauth_state", state, 600),
    },
  });
}
