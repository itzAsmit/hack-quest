import { HeroSection } from "@/components/landing/HeroSection";
import { ActivityTicker } from "@/components/landing/ActivityTicker";
import { LandingFeatureGrid } from "@/components/landing/LandingFeatureGrid";
import { ScrollSequenceBackground } from "@/components/landing/ScrollSequenceBackground";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05070D]">
      <ScrollSequenceBackground />
      <main>
        <HeroSection />
        <ActivityTicker />
        <LandingFeatureGrid />
      </main>
    </div>
  );
}
