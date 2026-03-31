"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[1400px] transition-all duration-500 ease-in-out ${
        scrolled ? "top-2 md:top-4" : "top-6 md:top-8"
      }`}
    >
      <nav className="w-full rounded-full border border-[rgba(110,168,255,0.15)] bg-[#0A1128]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-5 py-2.5 shadow-[0_0_40px_-10px_rgba(110,168,255,0.2)] transition-all duration-500">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3 relative shrink-0">
          {/* Subtle inside glow matching Ethena aesthetic */}
          <div className="absolute top-1/2 left-2 w-16 h-12 bg-white/20 blur-[20px] rounded-full -translate-y-1/2 pointer-events-none" />
          
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-transparent shrink-0 relative z-10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="12" />
              <line x1="22" y1="8.5" x2="12" y2="12" />
              <line x1="2" y1="8.5" x2="12" y2="12" />
            </svg>
          </div>
          <span className="font-medium text-[1.1rem] tracking-tight text-white hidden sm:block relative z-10">HackQuest</span>
        </div>
        
        {/* Center: Links */}
        <div className="hidden lg:flex items-center justify-center gap-8 text-[13px] font-medium text-[rgba(255,255,255,0.8)] absolute left-1/2 -translate-x-1/2">
          <Link href="#" className="hover:text-white transition-colors">Home</Link>
          <Link href="#" className="flex items-center gap-1 hover:text-white transition-colors">Products <ChevronDown size={14} /></Link>
          <Link href="#" className="hover:text-white transition-colors">Ecosystem</Link>
          <Link href="#" className="hover:text-white transition-colors">Network</Link>
          <Link href="#" className="hover:text-white transition-colors">Transparency</Link>
          <Link href="#" className="flex items-center gap-1 hover:text-white transition-colors">Resources <ChevronDown size={14} /></Link>
        </div>
        
        {/* Right: Metrics & CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-3 px-4 py-[6px] rounded-full border border-[rgba(255,255,255,0.12)] bg-transparent text-[11px] font-medium text-[rgba(255,255,255,0.9)]">
            <span className="flex items-center gap-[6px] tracking-wide">
              <span className="w-3 h-3 rounded-full border border-[rgba(255,255,255,0.3)] flex items-center justify-center text-[8px] opacity-70">i</span>
              120+ Quests
            </span>
            <div className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-[6px] tracking-wide">
              <span className="w-3 h-3 rounded-full border border-[rgba(255,255,255,0.3)] flex items-center justify-center text-[8px] opacity-70">i</span>
              45k+ Devs
            </span>
          </div>
          <button className="px-5 py-2 rounded-full border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[13px] font-medium text-white bg-transparent shrink-0">
            Launch App
          </button>
        </div>
      </nav>
    </div>
  );
}
