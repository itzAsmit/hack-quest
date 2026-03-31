"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { DottedSurface } from "@/components/ui/dotted-surface";

export function HeroSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: { duration: 0.6, ease: "easeOut" as const },
  };

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6">
      <DottedSurface className="-z-10 opacity-80" />

      <div className="absolute inset-0 -z-[9] bg-[radial-gradient(1200px_circle_at_12%_8%,rgba(255,99,72,0.20),transparent_45%),radial-gradient(980px_circle_at_86%_12%,rgba(14,165,233,0.15),transparent_43%),linear-gradient(180deg,rgba(4,7,14,0.70)_0%,rgba(4,7,14,0.95)_75%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.span
            {...fadeInUp}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200/30 bg-orange-200/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100"
          >
            <Sparkles className="h-3.5 w-3.5" />
            HackQuest Season Zero
          </motion.span>

          <motion.h1
            {...fadeInUp}
            transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
            className="mt-6 text-4xl font-black uppercase leading-[0.98] text-white sm:text-5xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build Hard.
            <span className="block bg-gradient-to-r from-orange-100 via-amber-200 to-sky-200 bg-clip-text text-transparent">
              Earn On-Chain.
            </span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg"
          >
            HackQuest is the competitive layer for hackathons: quests, score flow, NFT rewards,
            and organizer command tools in one fast interface.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200/45 bg-orange-300/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-orange-50 transition hover:border-orange-200/75 hover:bg-orange-300/30"
            >
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-6 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white/90 transition hover:border-white/40 hover:bg-white/[0.07]"
            >
              Start Building
            </Link>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.16em] text-slate-300"
          >
            <span className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5">Realtime quests</span>
            <span className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5">NFT achievements</span>
            <span className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5">Live leaderboard</span>
          </motion.div>
        </div>

        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
          className="grid gap-3"
        >
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-900/60 backdrop-blur-xl">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80"
              alt="Hackathon team working with laptops"
              className="h-52 w-full object-cover"
            />
            <div className="grid grid-cols-2 gap-2 p-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <Compass className="h-4 w-4 text-orange-200" />
                <p className="mt-2 text-base font-semibold text-slate-100 sm:text-lg">42</p>
                <p className="text-[10px] uppercase tracking-[0.13em] text-slate-400">Live Quests</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <ShieldCheck className="h-4 w-4 text-sky-200" />
                <p className="mt-2 text-base font-semibold text-slate-100 sm:text-lg">97%</p>
                <p className="text-[10px] uppercase tracking-[0.13em] text-slate-400">Event Uptime</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200/25 bg-orange-300/10 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.15em] text-orange-100/80">Operator + Player Surface</p>
            <p className="mt-2 text-sm leading-relaxed text-orange-50/95">
              Players track momentum and rewards while organisers run events, moderate quests,
              and ship outcomes live.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[2] h-36 bg-gradient-to-t from-hq-bg-primary to-transparent" />
    </section>
  );
}
