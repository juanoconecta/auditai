import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DemoSection from "@/components/DemoSection";
import PricingSection from "@/components/PricingSection";

export default function Home() {
  return (
    <div style={{ background: "#1A1A2E", minHeight: "100vh" }}>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <DemoSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
