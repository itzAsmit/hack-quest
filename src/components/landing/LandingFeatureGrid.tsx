"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Blocks,
  Coins,
  Globe,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Card, CardCanvas } from "@/components/ui/animated-glow-card";

const features = [
  {
    title: "Quest Engine",
    description: "Organisers define challenge tracks, checkpoints, and XP rewards in minutes.",
    icon: Target,
    href: "/events",
  },
  {
    title: "NFT Reward Rail",
    description: "Mint and distribute blockchain-backed collectibles as proof of achievement.",
    icon: Blocks,
    href: "/showplace",
  },
  {
    title: "Live Rankings",
    description: "Leaderboard updates in near real-time so teams can track position as they build.",
    icon: Award,
    href: "/leaderboard",
  },
  {
    title: "Secure Wallet Actions",
    description: "Deposit, withdraw, and settle on-chain activity with transparent event history.",
    icon: Coins,
    href: "/dashboard/wallet",
  },
  {
    title: "Global Event Reach",
    description: "Host online or hybrid hackathons and keep participant activity in one system.",
    icon: Globe,
    href: "/events",
  },
  {
    title: "Organiser Controls",
    description: "Manage events, players, and quests through a role-gated organiser workspace.",
    icon: ShieldCheck,
    href: "/organiser",
  },
];

const flow = [
  {
    id: "01",
    title: "Join An Event",
    text: "Pick a live or upcoming hackathon and enter with your team or solo profile.",
  },
  {
    id: "02",
    title: "Complete Quests",
    text: "Submit milestones and complete challenge objectives to gain verified XP.",
  },
  {
    id: "03",
    title: "Earn Rewards",
    text: "Collect NFTs, wallet rewards, and rank momentum based on real contributions.",
  },
  {
    id: "04",
    title: "Climb The Board",
    text: "Compete globally with live scoring tied to event and on-chain activity.",
  },
];

export function LandingFeatureGrid() {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/90">
            <Sparkles className="h-3.5 w-3.5" />
            Platform Capability
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Built for high-signal hackathons, not generic event pages.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            HackQuest combines event execution, quest systems, NFT rewards, and ranking intelligence into one product surface.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group"
              >
                <CardCanvas>
                  <Card className="h-full">
                    <Link
                      href={feature.href}
                      className="relative block h-full overflow-hidden rounded-xl p-4"
                    >
                      <div className="mb-3 inline-flex rounded-lg border border-cyan-100/20 bg-slate-900/80 p-2 text-cyan-100">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-100">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">{feature.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/80">
                        Explore
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </Card>
                </CardCanvas>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 grid gap-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4 sm:p-6 md:grid-cols-4">
          {flow.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <CardCanvas>
                <Card className="p-3.5">
                  <span className="text-xs font-semibold tracking-[0.15em] text-cyan-200/80">{step.id}</span>
                  <h3 className="mt-2 text-sm font-semibold text-white sm:text-base">{step.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">{step.text}</p>
                </Card>
              </CardCanvas>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
