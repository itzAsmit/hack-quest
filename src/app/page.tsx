import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { LeaderboardWidget } from "@/components/landing/LeaderboardWidget";
import { EventsTeaser } from "@/components/landing/EventsTeaser";
import { ActivityTicker } from "@/components/landing/ActivityTicker";
import { LandingFeatureGrid } from "@/components/landing/LandingFeatureGrid";
import { LandingShowcase } from "@/components/landing/LandingShowcase";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-hq-bg-primary">
      <Navbar />
      <main>
        <HeroSection />
        <ActivityTicker />
        <LandingFeatureGrid />
        <LandingShowcase />
        <EventsTeaser />
        <LeaderboardWidget />
      </main>
      <Footer />
    </div>
  );
}
