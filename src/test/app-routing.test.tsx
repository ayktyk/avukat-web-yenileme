import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes, RouterProvider, createMemoryRouter } from "react-router-dom";
import BlogIndex, { loader as blogIndexLoader } from "@/pages/BlogIndex";
import BlogPost, { loader as blogPostLoader } from "@/pages/BlogPost";
import LegalUpdatesIndex, { loader as legalUpdatesIndexLoader } from "@/pages/LegalUpdatesIndex";
import KvkkAydinlatma from "@/pages/KvkkAydinlatma";
import NotFound from "@/pages/NotFound";

const renderAt = (path: string, element: React.ReactElement, routePath: string) => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={routePath} element={element} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );
};

/**
 * Loader'a bagli sayfalar data router gerektirir. hydrationData ile loader ciktisini
 * onceden veriyoruz — prerender sirasinda olusan durumun aynisi.
 */
const renderWithLoader = async (
  id: string,
  path: string,
  element: React.ReactElement,
  loader: () => Promise<unknown>,
) => {
  const loaderData = await loader();
  const router = createMemoryRouter([{ id, path, element, loader: loader as never }], {
    initialEntries: [path],
    hydrationData: { loaderData: { [id]: loaderData } },
  });

  return render(
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>,
  );
};

describe("app routing", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the blog index route", async () => {
    await renderWithLoader("blog-index", "/blog", <BlogIndex />, blogIndexLoader);

    expect(await screen.findByRole("heading", { name: "Blog Yazıları" })).toBeInTheDocument();
    expect(screen.getByText("Ana sayfaya dön")).toBeInTheDocument();
  });

  // Regresyon korumasi: liste useEffect ile cekilirse prerendered HTML'de yazi
  // baglantilarinin hicbiri olmaz ve Googlebot yalnizca "yukleniyor" metnini gorur.
  it("blog index'i yazi baglantilariyla birlikte ilk render'da uretir", async () => {
    const { container } = await renderWithLoader("blog-index", "/blog", <BlogIndex />, blogIndexLoader);

    const postLinks = container.querySelectorAll('a[href^="/blog/"]');
    expect(postLinks.length).toBeGreaterThan(0);
    expect(screen.queryByText("Yazılar yükleniyor...")).not.toBeInTheDocument();
  });

  it("renders a blog detail route", async () => {
    const slug = "ise-iade-arabuluculukta-kritik-noktalar";
    const loaderData = await blogPostLoader({
      params: { slug },
      request: undefined as unknown as Request,
      context: undefined,
    });
    const router = createMemoryRouter(
      [{ id: "blog-post", path: "/blog/:slug", element: <BlogPost />, loader: blogPostLoader }],
      {
        initialEntries: [`/blog/${slug}`],
        hydrationData: { loaderData: { "blog-post": loaderData } },
      },
    );
    render(
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>,
    );

    expect(await screen.findByRole("heading", { name: "İşe İade Arabuluculukta Kritik Noktalar" })).toBeInTheDocument();
    expect(screen.getAllByText("Blog listesine dön")[0]).toBeInTheDocument();
  });

  it("renders the legal updates index route", async () => {
    const { container } = await renderWithLoader(
      "legal-updates-index",
      "/guncel-hukuk-gundemi",
      <LegalUpdatesIndex />,
      legalUpdatesIndexLoader,
    );

    expect(await screen.findByRole("heading", { name: "Güncel Hukuk Gündemi" })).toBeInTheDocument();
    expect(container.querySelectorAll('a[href^="/guncel-hukuk-gundemi/"]').length).toBeGreaterThan(0);
  });

  it("renders the kvkk legal page route", async () => {
    renderAt("/kvkk-aydinlatma", <KvkkAydinlatma />, "/kvkk-aydinlatma");

    expect(await screen.findByRole("heading", { name: "KVKK Aydınlatma Metni" })).toBeInTheDocument();
  });

  it("renders not found for unknown routes", async () => {
    renderAt("/olmayan-sayfa", <div />, "/bilinen-yol");

    expect(await screen.findByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByText("Sayfa bulunamadı")).toBeInTheDocument();
  });
});
