import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HashScrollManager, SiteSearchProvider } from "@/components/search/SiteSearch";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";

const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ClientReviewsPage = lazy(() => import("./pages/ClientReviewsPage"));
const LegalUpdatesIndex = lazy(() => import("./pages/LegalUpdatesIndex"));
const LegalUpdatePost = lazy(() => import("./pages/LegalUpdatePost"));
const CerezPolitikasi = lazy(() => import("./pages/CerezPolitikasi"));
const HukukiUyari = lazy(() => import("./pages/HukukiUyari"));
const KvkkAydinlatma = lazy(() => import("./pages/KvkkAydinlatma"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <SiteSearchProvider>
        <HashScrollManager />
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <p className="text-muted-foreground">YÃ¼kleniyor...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/muvekkil-yorumlari" element={<ClientReviewsPage />} />
            <Route path="/guncel-hukuk-gundemi" element={<LegalUpdatesIndex />} />
            <Route path="/guncel-hukuk-gundemi/:slug" element={<LegalUpdatePost />} />
            <Route path="/kvkk-aydinlatma" element={<KvkkAydinlatma />} />
            <Route path="/cerez-politikasi" element={<CerezPolitikasi />} />
            <Route path="/hukuki-uyari" element={<HukukiUyari />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </SiteSearchProvider>
    </BrowserRouter>
  </>
);

export default App;
