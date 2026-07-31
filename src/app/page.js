import Footer from "@/components/Footer";
import ExploreByCategory from "@/components/homepage/ExploreByCategory";
import HeroSection from "@/components/homepage/HeroSection";
import HowItWorks from "@/components/homepage/HowItWorks";
import PlatformImpact from "@/components/homepage/PlatformImpact";
import Testimonials from "@/components/homepage/Testimonials";
import TopFundedCampaigns from "@/components/homepage/TopFundedCampaigns";
import Navbar from "@/components/Navbar";


export default function Home() {
  return (
    <div className="">
      <main>
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <ExploreByCategory />
        <PlatformImpact />
        <Testimonials />
        <TopFundedCampaigns />
        <Footer />
      </main>
    </div>
  );
}
