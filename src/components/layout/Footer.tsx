"use client";

import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin, Zap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-hq-bg-secondary/50">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-hq-accent-purple/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 bg-gradient-to-br from-hq-accent-purple to-hq-accent-violet rounded-lg transform rotate-45" />
                <div className="absolute inset-[2px] bg-hq-bg-primary rounded-[4px] transform rotate-45" />
                <span className="absolute inset-0 flex items-center justify-center text-hq-accent-glow font-heading font-bold text-xs">
                  H
                </span>
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                <span className="text-hq-text-primary">HACK</span>
                <span className="gradient-text">QUEST</span>
              </span>
            </Link>
            <p className="text-sm text-hq-text-muted leading-relaxed max-w-xs">
              The gamified hackathon platform. Earn XP, collect NFTs, and compete globally.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-hq-text-primary mb-4 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {["Events", "Showplace", "Auction", "Leaderboard"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-hq-text-muted hover:text-hq-accent-violet transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Players */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-hq-text-primary mb-4 uppercase tracking-wider">
              Players
            </h4>
            <ul className="space-y-2.5">
              {["Login", "Register", "Dashboard", "NFT Collection"].map((item) => (
                <li key={item}>
                  <Link
                    href={
                      item === "Login" ? "/login" :
                      item === "Register" ? "/register" :
                      item === "Dashboard" ? "/dashboard/overview" :
                      "/dashboard/nfts"
                    }
                    className="text-sm text-hq-text-muted hover:text-hq-accent-violet transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-hq-text-primary mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex items-center gap-3">
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
                  className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-hq-accent-purple/40 hover:bg-hq-accent-purple/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-hq-text-muted" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-hq-text-muted">
            © {new Date().getFullYear()} HackQuest. All rights reserved.
          </p>
          <p className="text-xs text-hq-text-muted flex items-center gap-1.5">
            Built with
            <Heart className="w-3 h-3 text-hq-danger fill-hq-danger" />
            and
            <Zap className="w-3 h-3 text-hq-gold fill-hq-gold" />
          </p>
        </div>
      </div>
    </footer>
  );
}
