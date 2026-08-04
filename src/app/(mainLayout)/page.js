import ExploreByCategory from "@/components/homepage/ExploreByCategory";
import HeroSection from "@/components/homepage/HeroSection";
import HowItWorks from "@/components/homepage/HowItWorks";
import PlatformImpact from "@/components/homepage/PlatformImpact";
import Testimonials from "@/components/homepage/Testimonials";
import TopFundedCampaigns from "@/components/homepage/TopFundedCampaigns";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <ExploreByCategory />
      <PlatformImpact />
      <Testimonials />
      <TopFundedCampaigns />
    </main>
  );
}
