import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HighlightsSection() {
  const highlights = [
    {
      id: "yield-scales",
      type: "PRESS",
      date: "March 2026",
      title: "Algorand Scales Digital Native Yield",
      description: "The latest integration allows millions of users to tap into sustainable yield directly from their digital wallets.",
      url: "#"
    },
    {
      id: "crypto-fintech",
      type: "TECH",
      date: "Feb 2026",
      title: "Advanced Cryptography For Next-Gen Fintech",
      description: "Exploring the underlying protocol mechanics that allow instant settlement and high-frequency capabilities.",
      url: "#"
    },
    {
      id: "summit-2026",
      type: "EVENTS",
      date: "Jan 2026",
      title: "Upcoming Global Crypto Summit",
      description: "Join us next month as we unveil our institutional product suite on the global stage.",
      url: "#"
    }
  ];

  return (
    <section className="py-24 px-6 md:px-20 max-w-7xl mx-auto z-20 relative bg-[#05070D]">
      <div className="text-center mb-16">
        <span className="text-[10px] uppercase tracking-widest text-[#6EA8FF] font-medium border border-[rgba(110,168,255,0.2)] bg-[rgba(110,168,255,0.05)] px-3 py-1 rounded-full mb-6 inline-block">
          NEWS
        </span>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Highlights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((item) => (
          <div key={item.id} className="glass-card rounded-2xl p-8 flex flex-col items-start group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-6">
               <span className="text-[10px] font-bold text-white tracking-widest bg-[rgba(255,255,255,0.1)] px-2 py-1 rounded">{item.type}</span>
               <span className="text-xs text-[rgba(255,255,255,0.4)]">{item.date}</span>
            </div>
            <h3 className="text-xl font-medium mb-3 leading-snug">{item.title}</h3>
            <p className="text-sm text-[rgba(255,255,255,0.6)] mb-8 leading-relaxed flex-1">
               {item.description}
            </p>
            <Link 
              href={item.url} 
              className="flex items-center gap-2 text-xs text-[#6EA8FF] uppercase tracking-wider font-semibold group-hover:gap-3 transition-all"
              aria-label={`Read more about ${item.title}`}
            >
              READ MORE <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>

    </section>
  );
}
