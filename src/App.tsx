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
        path: "e-tahsilat",
        lazy: async () => {
          const mod = await import("./pages/ETahsilat");
          return { Component: mod.default };
        },
      },
      {
        path: "hesaplamalar",
        lazy: async () => {
          const mod = await import("./pages/CalculatorsIndex");
          return { Component: mod.default };
        },
      },
      {
        path: "hesaplamalar/iscilik-alacaklari",
        lazy: async () => {
          const mod = await import("./pages/IscilikCalculator");
          return { Component: mod.default };
        },
      },
      {
        path: "hesaplamalar/miras-payi",
        lazy: async () => {
          const mod = await import("./pages/MirasCalculator");
          return { Component: mod.default };
        },
      },
      {
        path: "hesaplamalar/infaz",
        lazy: async () => {
          const mod = await import("./pages/InfazCalculator");
          return { Component: mod.default };
        },
      },
      {
        path: "hesaplamalar/vekalet-ucreti",
        lazy: async () => {
          const mod = await import("./pages/VekaletCalculator");
          return { Component: mod.default };
        },
      },
      {
        path: "hesaplamalar/arabuluculuk-ucreti",
        lazy: async () => {
          const mod = await import("./pages/ArabuluculukCalculator");
          return { Component: mod.default };
        },
      },
      {
        path: "hesaplamalar/faiz",
        lazy: async () => {
          const mod = await import("./pages/FaizCalculator");
          return { Component: mod.default };
        },
      },
      {
        path: "hesaplamalar/harc",
        lazy: async () => {
          const mod = await import("./pages/HarcCalculator");
          return { Component: mod.default };
        },
      },
      {
        path: "hesaplamalar/kira-sureleri",
        lazy: async () => {
          const mod = await import("./pages/KiraSureleriCalculator");
          return { Component: mod.default };
        },
      },
      {
        path: "hesaplamalar/kaza-tazminati",
        lazy: async () => {
          const mod = await import("./pages/KazaTazminatiCalculator");
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
