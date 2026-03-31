import { HeroSection } from "@/components/landing/HeroSection";
import { ActivityTicker } from "@/components/landing/ActivityTicker";
import { LandingFeatureGrid } from "@/components/landing/LandingFeatureGrid";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05070D]">
      <main>
        <HeroSection />
        <ActivityTicker />
        <LandingFeatureGrid />
      </main>
    </div>
  );
}
