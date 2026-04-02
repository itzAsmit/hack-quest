"use client";

import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin, Zap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-black">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 transition-transform group-hover:scale-110">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                  <line x1="22" y1="8.5" x2="12" y2="12" />
                  <line x1="2" y1="8.5" x2="12" y2="12" />
                </svg>
              </div>
              <span className="font-heading font-black text-xl tracking-tighter uppercase text-white">
                HackQuest
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              The premier gamified arena for global developers. Forge your 1337 legacy through high-stakes code challenges and exclusive digital collectibles.
            </p>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] font-black text-white/20 mb-6 uppercase tracking-[0.3em]">
              Navigation
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Quest Arena", href: "/events" },
                { label: "Showplace", href: "/showplace" },
                { label: "Trading Hall", href: "/auction" },
                { label: "Hall of Legends", href: "/leaderboard" }
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Players */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] font-black text-white/20 mb-6 uppercase tracking-[0.3em]">
              Player Base
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Authentication", href: "/login" },
                { label: "Join Network", href: "/register" },
                { label: "Mission Dashboard", href: "/dashboard/overview" },
                { label: "Asset Vault", href: "/dashboard/nfts" }
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] font-black text-white/20 mb-6 uppercase tracking-[0.3em]">
              Network
            </h4>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github, href: "#", label: "GitHub" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
                >
                  <Icon className="w-4 h-4 text-white/60" />
                </a>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-[#2ECC71]">Network Core Stable</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} HackQuest Platform. Encrypted & Final.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/20 uppercase tracking-[0.1em]">
            Optimized for
            <Zap className="w-3 h-3 text-hq-gold fill-hq-gold" />
            Performance & 
            <Heart className="w-3 h-3 text-hq-danger fill-hq-danger" />
            Experience
          </div>
        </div>
      </div>
    </footer>
  );
}
