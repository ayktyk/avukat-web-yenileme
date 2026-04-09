import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import EagerBlogPost from "./pages/BlogPost";
import EagerLegalUpdatePost from "./pages/LegalUpdatePost";

const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = import.meta.env.MODE === "test" ? EagerBlogPost : lazy(() => import("./pages/BlogPost"));
const LegalUpdatesIndex = lazy(() => import("./pages/LegalUpdatesIndex"));
const LegalUpdatePost =
  import.meta.env.MODE === "test" ? EagerLegalUpdatePost : lazy(() => import("./pages/LegalUpdatePost"));
const ServicesIndex = lazy(() => import("./pages/ServicesIndex"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const CerezPolitikasi = lazy(() => import("./pages/CerezPolitikasi"));
const HukukiUyari = lazy(() => import("./pages/HukukiUyari"));
const KvkkAydinlatma = lazy(() => import("./pages/KvkkAydinlatma"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/guncel-hukuk-gundemi" element={<LegalUpdatesIndex />} />
          <Route path="/guncel-hukuk-gundemi/:slug" element={<LegalUpdatePost />} />
          <Route path="/hizmetler" element={<ServicesIndex />} />
          <Route path="/hizmetler/:slug" element={<ServicePage />} />
          <Route path="/kvkk-aydinlatma" element={<KvkkAydinlatma />} />
          <Route path="/cerez-politikasi" element={<CerezPolitikasi />} />
          <Route path="/hukuki-uyari" element={<HukukiUyari />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </>
);

export default App;
