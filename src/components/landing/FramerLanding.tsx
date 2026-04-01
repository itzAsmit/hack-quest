"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Target, Blocks, Award, Coins, Globe, ShieldCheck, ArrowRight, Activity, BarChart3, Settings, Code2, Zap, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function HeroSection() {
  return (
    <section className="relative overflow-hidden flex flex-col items-center px-4 pt-4 pb-20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#9D50FF]/30 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="min-h-[85vh] flex flex-col items-center justify-center w-full px-4 pt-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Badge */}
          <div className="flex items-center gap-2 bg-black border border-white/10 rounded-full pl-1 pr-3 py-1 mb-8">
            <span className="bg-[#9D50FF] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" /> Rail
            </span>
            <span className="text-white/80 text-sm font-medium">HackQuest Reward Rail</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-white tracking-tight leading-[1.05] mb-6 max-w-4xl" style={{ fontFamily: "var(--font-heading)" }}>
            Build with hacks. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E050FF] to-[#9D50FF]">Withdraw in ALGO.</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
            Complete quests to earn Hacks, convert value to ALGO, and transfer directly to connected wallets with full visibility.
          </p>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/events" className="bg-white text-black font-semibold text-base py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Explore Events
            </Link>
            <Link href="/dashboard/wallet" className="bg-white/10 border border-white/20 text-white font-semibold text-base py-3 px-8 rounded-full hover:bg-white/20 transition-all">
              Open Wallet
            </Link>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/40">
             <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1">Quest XP</span>
             <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1">Hacks balance</span>
             <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1">ALGO transfer</span>
          </div>
        </motion.div>
      </div>

      {/* Dashboard Mockup - Now following the centered block */}
      <motion.div 
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full max-w-6xl mt-[-5vh] px-4"
      >
        <div className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-2xl overflow-hidden shadow-[0_0_100px_rgba(157,80,255,0.15)] ring-1 ring-white/5 mx-auto text-left">
          {/* MacOS Window Controls */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            <div className="ml-4 text-xs font-mono text-white/30">hackquest.app/dashboard</div>
          </div>
          
          {/* Mockup Content */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 border border-white/10 rounded-xl bg-white/[0.02] p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-white font-medium mb-1">Platform Activity</h3>
                  <p className="text-white/40 text-sm">Live Hackathon ↗</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <Target className="w-5 h-5 text-[#9D50FF]" />
                  <span className="text-white/80 text-sm font-medium">Quest Progress</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-transparent transition-colors">
                  <Award className="w-5 h-5 text-white/40" />
                  <span className="text-white/60 text-sm">Global Leaderboard</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-transparent transition-colors">
                  <Wallet className="w-5 h-5 text-white/40" />
                  <span className="text-white/60 text-sm">ALGO Wallet</span>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl p-6">
                  <p className="text-white/40 text-sm mb-2">Hacks Balance</p>
                  <h4 className="text-3xl font-bold text-white mb-4">24,592</h4>
                  {/* Fake Chart */}
                  <div className="w-full h-24 flex items-end gap-2">
                    {[40, 60, 45, 80, 55, 90, 75, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-[#9D50FF]/20 to-[#9D50FF] rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-white/40 text-sm mb-2">Level Progress</p>
                    <h4 className="text-3xl font-bold text-white">98%</h4>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-4">
                    <div className="w-[98%] h-full bg-[#E050FF]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function LogoTicker() {
  const logos = ["Algorand", "Solana", "Polygon", "Ethereum", "Avalanche", "Near", "Algorand", "Solana"];
  
  return (
    <div className="py-10 border-y border-white/5 overflow-hidden relative flex items-center bg-black">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
      
      <motion.div 
        animate={{ x: "-50%" }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-16 whitespace-nowrap px-8"
      >
        {logos.concat(logos).map((logo, i) => (
          <div key={i} className="text-white/30 font-bold text-xl uppercase tracking-wider flex items-center gap-2 font-heading">
            <div className="w-6 h-6 rounded-full bg-white/10 border border-white/5" />
            {logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="py-32 px-4 bg-black relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#9D50FF]" />
            Platform Capability
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Built for high-signal hackathons,<br />not generic event pages.
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body">
            HackQuest combines event execution, quest systems, NFT rewards, and ranking intelligence into one product surface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Feature Card 1 */}
          <div className="col-span-1 lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#9D50FF]/10 blur-[80px] rounded-full group-hover:bg-[#9D50FF]/20 transition-colors" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="mb-20">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Quest Engine</h3>
                <p className="text-white/50 text-lg max-w-md">Organisers define challenge tracks, checkpoints, and XP rewards in minutes to keep participants fully engaged.</p>
              </div>
              <div className="w-full bg-black/50 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-2 bg-white/10 rounded-full w-3/4" />
                  <div className="h-2 bg-white/10 rounded-full w-1/2" />
                </div>
                <div className="w-10 h-10 rounded-full bg-[#9D50FF] flex items-center justify-center shadow-[0_0_15px_#9D50FF]">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="col-span-1 bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-[#E050FF]/10 blur-[60px] rounded-full group-hover:bg-[#E050FF]/20 transition-colors" />
            <div className="relative z-10">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                  <Blocks className="w-6 h-6 text-white" />
                </div>
              <h3 className="text-2xl font-semibold text-white mb-3">NFT Reward Rail</h3>
              <p className="text-white/50 text-lg">Mint and distribute blockchain-backed collectibles as proof of achievement.</p>
            </div>
            {/* Abstract visual */}
            <div className="mt-12 h-32 relative flex items-center justify-center">
              <div className="w-16 h-16 border border-[#9D50FF] rounded-full animate-ping absolute opacity-20" />
              <div className="w-16 h-16 bg-gradient-to-tr from-[#9D50FF] to-[#E050FF] rounded-full flex items-center justify-center shadow-[0_0_30px_#9D50FF]">
                <Blocks className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="col-span-1 bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                  <Award className="w-6 h-6 text-white" />
                </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Live Rankings</h3>
              <p className="text-white/50 text-lg">Leaderboard updates in near real-time so teams can track position as they build.</p>
            </div>
          </div>

          {/* Feature Card 4 */}
          <div className="col-span-1 lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden group flex flex-col md:flex-row gap-8 items-center">
             <div className="relative z-10 flex-1">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                  <Coins className="w-6 h-6 text-white" />
                </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Secure Wallet Actions</h3>
              <p className="text-white/50 text-lg mb-6">Deposit, withdraw, and settle on-chain activity with transparent event history.</p>
              <Link href="/dashboard/wallet" className="inline-block text-white bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full text-sm font-medium transition-colors border border-white/10">
                Open Wallet
              </Link>
            </div>
            
            <div className="flex-1 w-full bg-[#0D0D12] border border-white/10 rounded-xl p-4 font-mono text-sm text-white/70">
              <div className="flex gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <p><span className="text-[#E050FF]">import</span> {'{'} wallet {'}'} <span className="text-[#E050FF]">import</span> from '@hackquest/sdk'</p>
              <br/>
              <p><span className="text-[#E050FF]">const</span> balance = <span className="text-[#9D50FF]">await</span> wallet.getHacks()</p>
              <p><span className="text-[#E050FF]">await</span> wallet.withdrawToAlgo(balance)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="py-32 px-4 relative overflow-hidden bg-black flex justify-center border-t border-white/10 text-center">
      {/* Glow background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#9D50FF]/20 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_80%_at_50%_100%,#000_40%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-4xl bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-12 md:p-20 text-center shadow-[0_0_50px_rgba(157,80,255,0.1)]">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
          Ready to launch <br /> your next Hackathon?
        </h2>
        
        <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
          Compete globally with live scoring tied to event and on-chain activity. Join a live hackathon or host your own.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/events" className="bg-white text-black font-semibold rounded-full w-full sm:w-auto px-8 py-4 hover:scale-105 transition-transform shrink-0">
            Explore Events
          </Link>
          <Link href="/organiser" className="bg-white/10 border border-white/20 text-white font-semibold rounded-full w-full sm:w-auto px-8 py-4 hover:bg-white/15 transition-all shrink-0">
            Organiser Workspace
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black py-12 px-8 border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="12" />
              <line x1="22" y1="8.5" x2="12" y2="12" />
              <line x1="2" y1="8.5" x2="12" y2="12" />
            </svg>
          <span className="text-white font-heading text-lg font-black tracking-tight uppercase">HackQuest</span>
        </div>
        
        <div className="flex gap-6 text-sm text-white/50">
          <Link href="/events" className="hover:text-white transition-colors">Events</Link>
          <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
          <Link href="/auction" className="hover:text-white transition-colors">Trading</Link>
        </div>
      </div>
    </footer>
  );
}

export function FramerLanding() {
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden selection:bg-[#9D50FF]/30 px-0">
      <HeroSection />
      <LogoTicker />
      <FeaturesSection />
      <BottomCTA />
      <Footer />
    </div>
  );
}

export default FramerLanding;
