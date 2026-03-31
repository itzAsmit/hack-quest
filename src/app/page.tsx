import { LandingNavbar } from "@/components/scrollytelling/LandingNavbar";
import dynamic from "next/dynamic";

const StickyEarthTransform = dynamic(
  () => import("@/components/scrollytelling/StickyEarthTransform").then(mod => mod.StickyEarthTransform),
  { ssr: false }
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05070D]">
      {/* Global overlay LandingNavbar */}
      <LandingNavbar />
      
      <main>
        <StickyEarthTransform />
      </main>
    </div>
  );
}
