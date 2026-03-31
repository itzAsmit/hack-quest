"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Coins, Wallet, Zap } from "lucide-react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { Card, CardCanvas } from "@/components/ui/animated-glow-card";

export function HeroSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: { duration: 0.6, ease: "easeOut" as const },
  };

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6">
      <DottedSurface className="-z-10 opacity-90" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.span
            {...fadeInUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-200"
          >
            <Zap className="h-3.5 w-3.5" />
            HackQuest Reward Rail
          </motion.span>

          <motion.h1
            {...fadeInUp}
            transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
            className="mt-5 text-4xl font-bold leading-[1.02] text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build with hacks.
            <span className="block text-slate-300">Withdraw in ALGO.</span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            Complete quests to earn Hacks, convert value to ALGO, and transfer directly to
            connected wallets with full visibility.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Explore Events
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/wallet"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Open Wallet
            </Link>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-2 text-xs text-slate-300"
          >
            <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1">Quest XP</span>
            <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1">Hacks balance</span>
            <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1">ALGO transfer</span>
          </motion.div>
        </div>

        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-md"
        >
          <CardCanvas>
            <Card className="p-3.5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-300">Reward Conversion Flow</p>
              <p className="mt-1 text-sm text-slate-400">How Hacks become ALGO in your wallet</p>

              <div className="mt-4 grid gap-3">
                <Card className="bg-white/[0.03] p-2.5">
                  <p className="text-[10px] uppercase tracking-[0.13em] text-slate-400">Step 1</p>
                  <div className="mt-1 flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 text-slate-300" />
                    <div>
                      <p className="text-sm font-semibold text-slate-100">Earn Hacks</p>
                      <p className="text-xs text-slate-400">Complete quests and rank up in events.</p>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-center py-0.5">
                  <div className="relative h-8 w-px bg-white/20">
                    <motion.span
                      className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-300"
                      animate={{ y: [0, 22, 0], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>

                <Card className="border-white/20 bg-white/5 p-2.5">
                  <p className="text-[10px] uppercase tracking-[0.13em] text-slate-300">Step 2</p>
                  <div className="mt-1 flex items-start gap-2">
                    <Coins className="mt-0.5 h-4 w-4 text-slate-300" />
                    <div>
                      <p className="text-sm font-semibold text-slate-100">Convert to ALGO</p>
                      <p className="text-xs text-slate-300">Platform settles reward value into ALGO.</p>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-center py-0.5">
                  <div className="relative h-8 w-px bg-white/20">
                    <motion.span
                      className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-300"
                      animate={{ y: [0, 22, 0], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.8, delay: 0.35, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>

                <Card className="border-white/20 bg-white/5 p-2.5">
                  <p className="text-[10px] uppercase tracking-[0.13em] text-slate-300">Step 3</p>
                  <div className="mt-1 flex items-start gap-2">
                    <Wallet className="mt-0.5 h-4 w-4 text-slate-300" />
                    <div>
                      <p className="text-sm font-semibold text-slate-100">Transfer to Wallet</p>
                      <p className="text-xs text-slate-300">Send ALGO directly to the connected address.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </CardCanvas>
        </motion.div>
      </div>
    </section>
  );
}
