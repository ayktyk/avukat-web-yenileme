import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";
import LegalUpdatesIndex from "@/pages/LegalUpdatesIndex";
import KvkkAydinlatma from "@/pages/KvkkAydinlatma";
import NotFound from "@/pages/NotFound";

const renderAt = (path: string, element: React.ReactElement, routePath: string) => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={element} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>,
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
    renderAt("/blog", <BlogIndex />, "/blog");

    expect(await screen.findByRole("heading", { name: "Blog Yazıları" })).toBeInTheDocument();
    expect(screen.getByText("Ana sayfaya dön")).toBeInTheDocument();
  });

  it("renders a blog detail route", async () => {
    renderAt("/blog/ise-iade-arabuluculukta-kritik-noktalar", <BlogPost />, "/blog/:slug");

    expect(await screen.findByRole("heading", { name: "İşe İade Arabuluculukta Kritik Noktalar" })).toBeInTheDocument();
    expect(screen.getAllByText("Blog listesine dön")[0]).toBeInTheDocument();
  });

  it("renders the legal updates index route", async () => {
    renderAt("/guncel-hukuk-gundemi", <LegalUpdatesIndex />, "/guncel-hukuk-gundemi");

    expect(await screen.findByRole("heading", { name: "Güncel Hukuk Gündemi" })).toBeInTheDocument();
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
