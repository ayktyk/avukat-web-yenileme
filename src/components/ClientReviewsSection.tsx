import GoogleReviewsPanel from "@/components/GoogleReviewsPanel";

const ClientReviewsSection = () => (
  <GoogleReviewsPanel
    sectionId="muvekkil-gorusleri"
    limit={6}
    title="Müvekkillerimizden Gelenler"
    description="Google Haritalar işletme profilimizde yer alan yorumlar bu alana otomatik olarak yansır."
  />
);

export default ClientReviewsSection;
