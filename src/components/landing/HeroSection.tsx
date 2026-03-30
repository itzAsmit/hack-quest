"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Target, Trophy } from "lucide-react";
import LaserFlow from "@/components/landing/LaserFlow";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6">
      <div className="absolute inset-0 z-0">
        <LaserFlow
          horizontalBeamOffset={0.08}
          verticalBeamOffset={0}
          horizontalSizing={0.52}
          verticalSizing={2}
          wispDensity={1}
          wispSpeed={14}
          wispIntensity={4}
          flowSpeed={0.3}
          flowStrength={0.22}
          fogIntensity={0.48}
          fogScale={0.28}
          fogFallSpeed={0.62}
          decay={1.1}
          falloffStart={1.15}
          color="#CDB4FF"
        />
      </div>

      <div className="absolute inset-0 z-[1] bg-[radial-gradient(900px_circle_at_10%_10%,rgba(14,165,233,0.22),transparent_42%),radial-gradient(860px_circle_at_82%_14%,rgba(217,70,239,0.20),transparent_45%),linear-gradient(180deg,rgba(2,6,23,0.60)_0%,rgba(2,6,23,0.9)_78%)]" />

      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute left-[10%] top-[23%] h-20 w-20 rounded-2xl border border-cyan-200/20 bg-cyan-200/5 blur-[0.3px]" />
        <div className="absolute right-[12%] top-[18%] h-28 w-28 rounded-full border border-fuchsia-300/20" />
        <div className="absolute bottom-[14%] left-[14%] h-40 w-40 rounded-full bg-fuchsia-300/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100"
          >
            <Sparkles className="h-3.5 w-3.5" />
            HackQuest Platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-6 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl"
          >
            Serious hackathons.
            <span className="block bg-gradient-to-r from-cyan-100 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
              Modern reward mechanics.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            HackQuest unifies event operations, quest progress, NFT rewards, and leaderboard movement in one focused interface for players and organisers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/40 bg-cyan-300/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-cyan-50 transition hover:border-cyan-200/70 hover:bg-cyan-300/30"
            >
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white/90 transition hover:border-white/40 hover:bg-white/[0.07]"
            >
              Create Profile
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-3"
        >
          <div className="rounded-2xl border border-white/15 bg-slate-900/55 p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Operator Snapshot</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: Target, value: "42", label: "Live Quests" },
                { icon: Trophy, value: "18.7K", label: "XP Today" },
                { icon: ShieldCheck, value: "97%", label: "Event Uptime" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <Icon className="h-4 w-4 text-cyan-100" />
                    <p className="mt-2 text-base font-semibold text-slate-100 sm:text-lg">{item.value}</p>
                    <p className="text-[10px] uppercase tracking-[0.13em] text-slate-400">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-fuchsia-200/20 bg-fuchsia-300/10 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.15em] text-fuchsia-100/80">Multi-role Surface</p>
            <p className="mt-2 text-sm leading-relaxed text-fuchsia-50/95">
              Players track progression and rewards while organisers run events and quest streams from dedicated dashboards.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[2] h-36 bg-gradient-to-t from-hq-bg-primary to-transparent" />
    </section>
  );
}
