"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Info, Activity, ShieldCheck, PieChart, Coins, Link as LinkIcon, Users, Trophy } from "lucide-react";
import Link from "next/link";

const AsciiPattern = () => {
  // Creating a highly dense ASCII text grid similar to Ethena
  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.25]"
      style={{ 
        maskImage: 'radial-gradient(ellipse at 40% 50%, black 20%, transparent 80%)', 
        WebkitMaskImage: 'radial-gradient(ellipse at 40% 50%, black 20%, transparent 80%)' 
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ascii-pattern-s" x="0" y="0" width="8" height="14" patternUnits="userSpaceOnUse">
            <text x="0" y="10" fill="rgba(255,255,255,0.06)" fontFamily="monospace" fontSize="10" fontWeight="bold">S</text>
          </pattern>
          <pattern id="ascii-pattern-accent" x="16" y="28" width="80" height="80" patternUnits="userSpaceOnUse">
            <text x="0" y="10" fill="rgba(110,168,255,0.3)" fontFamily="monospace" fontSize="10" fontWeight="bold">S</text>
          </pattern>
          <pattern id="ascii-pattern-e" x="32" y="14" width="40" height="40" patternUnits="userSpaceOnUse">
            <text x="0" y="10" fill="rgba(255,255,255,0.04)" fontFamily="monospace" fontSize="10">E</text>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#ascii-pattern-s)" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#ascii-pattern-e)" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#ascii-pattern-accent)" />
      </svg>
    </div>
  );
};

type HeroSectionProps = {
  introComplete: boolean;
};

export function HeroSection({ introComplete }: HeroSectionProps) {
  return (
    <div className="relative w-full h-[100vh] p-3 md:p-5 lg:p-6 flex flex-col z-10 pointer-events-none font-sans">
      
      {/* 
        The "Blue Card" specific to the Hero Section. 
        It visually encapsulates the hero text and metrics while allowing the 3D Earth underneath to be interacted with via pointer-events-none.
      */}
      <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2rem] border border-[rgba(110,168,255,0.15)] bg-[rgba(10,17,40,0.25)] shadow-[inset_0_0_100px_-20px_rgba(110,168,255,0.1),0_0_50px_-20px_rgba(110,168,255,0.1)] overflow-hidden flex flex-col justify-between pt-16 pb-12 pointer-events-none">
        
        <AsciiPattern />      {/* Mid Left Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.2, 0.65, 0.2, 1] }}
        className="px-6 md:px-12 lg:px-24 max-w-5xl pointer-events-auto flex-1 flex flex-col justify-center -mt-10"
      >
        {/* Exactly matching the Ethena font scale and tracking */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.65, 0.2, 1] }}
          className="text-[3.5rem] md:text-[5rem] lg:text-[5.5rem] font-medium leading-[1.05] tracking-tight mb-8 text-[#f4f4f5]"
        >
          Gamified Learning for the <br />
          Web3 Economy
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4, ease: [0.2, 0.65, 0.2, 1] }}
          className="flex"
        >
          <button className="px-6 py-[10px] rounded-full border border-[rgba(255,255,255,0.15)] bg-transparent text-[13px] font-medium hover:bg-white/5 disabled:opacity-50 transition-colors text-white relative">
            Earn with Quests
          </button>
        </motion.div>
      </motion.div>
      
      {/* Bottom Metrics Strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 2.2, ease: [0.2, 0.65, 0.2, 1] }}
        className="w-full px-6 md:px-12 lg:px-24 pointer-events-auto"
      >
        {/* Subtle glowing horizontal line matching screenshot fade */}
        <div className="w-4/5 h-[1px] bg-gradient-to-r from-[rgba(110,168,255,0.4)] via-[rgba(255,255,255,0.1)] to-transparent mb-[2.5rem]" />
        
        <div className="w-full grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-4 pr-10">
          <MetricCard value="120+" label="ACTIVE QUESTS" icon={<ShieldCheck size={12} />} />
          <MetricCard value="$2.5M" label="BOUNTY POOL" icon={<Coins size={12} />} />
          <MetricCard value="45K+" label="DEVELOPERS" icon={<Users size={12} />} />
          <MetricCard value="85" label="HACKATHONS" icon={<Trophy size={12} />} />
          <MetricCard value="15" label="CHAINS" icon={<LinkIcon size={12} />} />
          <MetricCard value="98%" label="COMPLETION RATE" icon={<PieChart size={12} />} />
        </div>
      </motion.div>


        <motion.div
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: introComplete ? 0 : 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 z-[15] bg-[radial-gradient(1200px_circle_at_50%_50%,rgba(5,7,13,0)_0%,rgba(5,7,13,0.55)_70%,rgba(5,7,13,0.8)_100%)]"
        />

      </div>
    </div>
  );
}

function MetricCard({ value, label, icon }: { value: string, label: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start text-left shrink-0">
      <span className="text-4xl md:text-[2.75rem] font-semibold text-[#f8f9fa] tracking-tighter leading-none mb-3">
        {value}
      </span>
      <span className="flex items-center gap-[6px] text-[10px] md:text-[11px] text-[#a1a1aa] font-medium tracking-wide uppercase">
        <span className="opacity-70 flex items-center justify-center w-4 h-4 rounded-full border border-white/20">
           {icon}
        </span>
        {label}
      </span>
    </div>
  );
}
