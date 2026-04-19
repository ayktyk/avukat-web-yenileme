import type { RouteRecord } from "vite-react-ssg";
import Layout from "./Layout";
import Index from "./pages/Index";

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    entry: "src/Layout.tsx",
    children: [
      {
        index: true,
        element: <Index />,
        entry: "src/pages/Index.tsx",
      },
      {
        path: "blog",
        lazy: async () => {
          const mod = await import("./pages/BlogIndex");
          return { Component: mod.default };
        },
      },
      {
        path: "blog/:slug",
        lazy: async () => {
          const mod = await import("./pages/BlogPost");
          return { Component: mod.default };
        },
      },
      {
        path: "guncel-hukuk-gundemi",
        lazy: async () => {
          const mod = await import("./pages/LegalUpdatesIndex");
          return { Component: mod.default };
        },
      },
      {
        path: "guncel-hukuk-gundemi/:slug",
        lazy: async () => {
          const mod = await import("./pages/LegalUpdatePost");
          return { Component: mod.default };
        },
      },
      {
        path: "hizmetler",
        lazy: async () => {
          const mod = await import("./pages/ServicesIndex");
          return { Component: mod.default };
        },
      },
      {
        path: "hizmetler/:slug",
        lazy: async () => {
          const mod = await import("./pages/ServicePage");
          return { Component: mod.default };
        },
      },
      {
        path: "ekip",
        lazy: async () => {
          const mod = await import("./pages/TeamIndex");
          return { Component: mod.default };
        },
      },
      {
        path: "ekip/:slug",
        lazy: async () => {
          const mod = await import("./pages/TeamMemberPage");
          return { Component: mod.default };
        },
      },
      {
        path: "kvkk-aydinlatma",
        lazy: async () => {
          const mod = await import("./pages/KvkkAydinlatma");
          return { Component: mod.default };
        },
      },
      {
        path: "cerez-politikasi",
        lazy: async () => {
          const mod = await import("./pages/CerezPolitikasi");
          return { Component: mod.default };
        },
      },
      {
        path: "hukuki-uyari",
        lazy: async () => {
          const mod = await import("./pages/HukukiUyari");
          return { Component: mod.default };
        },
      },
      {
        path: "*",
        lazy: async () => {
          const mod = await import("./pages/NotFound");
          return { Component: mod.default };
        },
      },
    ],
  },
];
