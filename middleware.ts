// Vercel Edge Middleware — Markdown for Agents content negotiation
// https://vercel.com/docs/edge-middleware
// https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
//
// When a request includes `Accept: text/markdown`, intercept and return the
// .md version with proper Content-Type. Browsers (Accept: text/html...) pass
// through to the static HTML.

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|llms.txt|og-image|admin|cms|uploads|embed|.well-known|static-loader-data-manifest).*)",
  ],
};

export default async function middleware(request: Request): Promise<Response | undefined> {
  const accept = request.headers.get("accept") || "";

  // Only intercept when client explicitly requests markdown.
  // Browsers send "text/html,application/xhtml+xml,..." — not text/markdown.
  if (!accept.toLowerCase().includes("text/markdown")) {
    return; // Pass through to static HTML
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // Already a .md request — pass through (static handler serves it)
  if (path.endsWith(".md") || path.endsWith(".json") || path.endsWith(".xml") || path.endsWith(".txt")) {
    return;
  }

  // Compute target .md path
  const mdPath = path === "/" || path === "" ? "/index.md" : `${path}.md`;
  const mdUrl = new URL(mdPath, url.origin);

  // Fetch the static .md file from same origin
  let upstream: Response;
  try {
    upstream = await fetch(mdUrl.toString(), {
      redirect: "manual",
      headers: { accept: "text/markdown" },
    });
  } catch {
    return; // Network error — fall through to HTML
  }

  if (!upstream.ok) {
    return; // .md not available — fall through to HTML
  }

  const body = await upstream.text();
  const tokenCount = Math.ceil(body.length / 4);

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, must-revalidate",
      "x-markdown-tokens": tokenCount.toString(),
      "x-markdown-source": "vega-hukuk-middleware",
      vary: "Accept",
      link: `<${url.origin}${path}>; rel="alternate"; type="text/html"`,
      "access-control-allow-origin": "*",
    },
  });
}
