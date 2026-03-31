import { LandingNavbar } from "@/components/scrollytelling/LandingNavbar";
import dynamic from "next/dynamic";

const StickyEarthTransform = dynamic(
  () => import("@/components/scrollytelling/StickyEarthTransform").then(mod => mod.StickyEarthTransform),
  { ssr: false }
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black p-2 md:p-3 overflow-x-hidden selection:bg-blue-500/30">
      {/* 
        The "Blue Card" container that acts as a subtle glowing wrapper 
        for the entire application content. 
      */}
      <div className="relative w-full h-full min-h-[calc(100vh-1.5rem)] rounded-[1.5rem] md:rounded-[2rem] border border-[rgba(110,168,255,0.15)] bg-[#05070D] shadow-[inset_0_0_100px_-20px_rgba(110,168,255,0.05),0_0_50px_-20px_rgba(110,168,255,0.1)] overflow-hidden">
        
        {/* Global overlay LandingNavbar */}
        <LandingNavbar />
        
        <main>
          <StickyEarthTransform />
        </main>
      </div>
    </div>
  );
}
