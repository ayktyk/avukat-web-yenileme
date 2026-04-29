// Vercel Edge Function — Markdown for Agents content negotiation
// https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/

export const config = {
  runtime: "edge",
};

const SAFE_PATH = /^[a-z0-9/_-]+$/i;

const buildMarkdownPath = (path: string): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const trimmed = normalized.endsWith("/") && normalized !== "/" ? normalized.slice(0, -1) : normalized;
  if (trimmed === "/" || trimmed === "") return "/index.md";
  return `${trimmed}.md`;
};

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  // Capture original path from query (set by vercel.json rewrite)
  const requestedPath = url.searchParams.get("p") || "/";

  // Sanity check — reject suspicious paths
  if (!SAFE_PATH.test(requestedPath) && requestedPath !== "/") {
    return new Response("Invalid path", { status: 400 });
  }

  const mdPath = buildMarkdownPath(requestedPath);
  const targetUrl = new URL(mdPath, `${url.protocol}//${url.host}`);

  // Fetch the static .md file from the same origin
  const upstream = await fetch(targetUrl.toString(), {
    redirect: "manual",
    headers: { accept: "text/markdown" },
  });

  if (!upstream.ok) {
    return new Response(
      `Markdown version not available for ${requestedPath}\n\nThis page does not have a markdown alternate. Try the HTML version: ${url.protocol}//${url.host}${requestedPath}\n`,
      {
        status: 404,
        headers: {
          "content-type": "text/markdown; charset=utf-8",
          "cache-control": "public, max-age=300",
        },
      },
    );
  }

  const body = await upstream.text();
  const tokenCount = Math.ceil(body.length / 4);

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, must-revalidate",
      "access-control-allow-origin": "*",
      "x-markdown-tokens": tokenCount.toString(),
      "x-markdown-source": "vega-hukuk-static",
      vary: "Accept",
      link: `<${url.protocol}//${url.host}${requestedPath}>; rel="alternate"; type="text/html"`,
    },
  });
}
