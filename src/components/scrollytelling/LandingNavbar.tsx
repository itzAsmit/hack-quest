"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import GlassSurface from "@/components/ui/GlassSurface";

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
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-[1240px] transition-all duration-500 ease-in-out ${
        scrolled ? "top-2 md:top-3" : "top-4 md:top-6"
      }`}
    >
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={40}
        borderWidth={0.03}
        displace={0.3}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        brightness={20}
        opacity={0.85}
        backgroundOpacity={0.6}
        mixBlendMode="normal"
        className="shadow-[0_0_30px_-8px_rgba(110,168,255,0.35),0_0_60px_-15px_rgba(110,168,255,0.15)]"
      >
        <nav className="w-full flex items-center justify-between px-5 md:px-7 py-2.5">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3 relative shrink-0">
          {/* Soft inner glow for the logo area */}
          <div className="absolute top-1/2 left-1 w-14 h-10 bg-[rgba(110,168,255,0.15)] blur-[16px] rounded-full -translate-y-1/2 pointer-events-none" />
          
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-transparent shrink-0 relative z-10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="12" />
              <line x1="22" y1="8.5" x2="12" y2="12" />
              <line x1="2" y1="8.5" x2="12" y2="12" />
            </svg>
          </div>
          <span className="font-medium text-[1.05rem] tracking-tight text-white hidden sm:block relative z-10">HackQuest</span>
        </div>
        
        {/* Center: Links */}
        <div className="hidden lg:flex items-center justify-center gap-8 text-[13px] font-medium text-[rgba(255,255,255,0.65)]">
          <Link href="/" className="relative text-white transition-colors py-2">
            Home
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-[120%] h-[2px] bg-[#6ea8ff] shadow-[0_0_12px_3px_rgba(110,168,255,0.5)] rounded-full" />
          </Link>
          <Link href="/events" className="hover:text-white transition-colors py-2">Events</Link>
          <Link href="/leaderboard" className="hover:text-white transition-colors py-2">Leaderboard</Link>
          <Link href="/trading-hall" className="hover:text-white transition-colors py-2">Trading Hall</Link>
        </div>
        
        {/* Right: Auth */}
        <div className="flex items-center gap-5 shrink-0">
          <Link href="/login" className="hidden md:block text-[13px] font-medium text-[rgba(255,255,255,0.75)] hover:text-white transition-colors">
            Player Login
          </Link>
          <Link href="/organiser-login" className="hidden md:block text-[13px] font-medium text-[rgba(255,255,255,0.75)] hover:text-white transition-colors">
            Organiser Login
          </Link>
          <Link href="/register" className="px-5 py-[8px] rounded-full border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[13px] font-medium text-white bg-transparent shrink-0">
            Register Now
          </Link>
        </div>
      </nav>
      </GlassSurface>
    </div>
  );
}
