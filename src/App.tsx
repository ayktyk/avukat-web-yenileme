import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import CerezPolitikasi from "./pages/CerezPolitikasi";
import HukukiUyari from "./pages/HukukiUyari";
import Index from "./pages/Index";
import KvkkAydinlatma from "./pages/KvkkAydinlatma";
import LegalUpdatePost from "./pages/LegalUpdatePost";
import LegalUpdatesIndex from "./pages/LegalUpdatesIndex";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/guncel-hukuk-gundemi" element={<LegalUpdatesIndex />} />
          <Route path="/guncel-hukuk-gundemi/:slug" element={<LegalUpdatePost />} />
          <Route path="/kvkk-aydinlatma" element={<KvkkAydinlatma />} />
          <Route path="/cerez-politikasi" element={<CerezPolitikasi />} />
          <Route path="/hukuki-uyari" element={<HukukiUyari />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
