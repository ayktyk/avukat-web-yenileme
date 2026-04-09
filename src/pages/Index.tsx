import { lazy } from "react";
import { DeferredRender } from "@/components/DeferredRender";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import { useSeo } from "@/hooks/use-seo";

const StatsBar = lazy(() => import("@/components/StatsBar"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const PracticeAreas = lazy(() => import("@/components/PracticeAreas"));
const TeamSection = lazy(() => import("@/components/TeamSection"));
const ArticlesSection = lazy(() => import("@/components/ArticlesSection"));
const LegalUpdatesSection = lazy(() => import("@/components/LegalUpdatesSection"));
const FaqSection = lazy(() => import("@/components/FaqSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const SiteFooter = lazy(() => import("@/components/SiteFooter"));
const FloatCTA = lazy(() => import("@/components/FloatCTA"));

const Index = () => {
  useSeo({
    title: "Vega Hukuk İstanbul | Hukuk Bürosu ve Danışmanlık",
    description:
      "İstanbul Kadıköy'de iş hukuku, ceza hukuku, kira, miras, tüketici ve sigorta alanında hukuki danışmanlık ve dava takibi. Randevu için iletişime geçin.",
    canonicalPath: "/",
  });

  return (
    <div className="overflow-x-hidden">
      <SiteHeader />
      <HeroSection />
      <DeferredRender>
        <StatsBar />
        <AboutSection />
        <hr className="h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />
        <PracticeAreas />
        <hr className="h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />
        <TeamSection />
        <hr className="h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />
        <ArticlesSection />
        <hr className="h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />
        <LegalUpdatesSection />
        <hr className="h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />
        <FaqSection />
        <hr className="h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />
        <ContactSection />
        <SiteFooter />
        <FloatCTA />
      </DeferredRender>
    </div>
  );
};

export default Index;
