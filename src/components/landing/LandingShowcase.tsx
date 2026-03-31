"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Radar, Sparkles } from "lucide-react";
import Link from "next/link";
import LaserFlow from "@/components/landing/LaserFlow";

type TinyParticle = {
  id: string;
  glyph: "0" | "1" | "$";
  left: number;
  top: number;
  opacity: number;
  size: number;
  delay: number;
  duration: number;
};

export function LandingShowcase() {
  const revealRef = useRef<HTMLDivElement | null>(null);

  const normalGlow = useMemo(
    () =>
      "radial-gradient(520px circle at 50% 40%, rgba(109, 40, 217, 0.30), rgba(14, 165, 233, 0.18) 30%, rgba(2, 6, 23, 0.0) 72%)",
    []
  );

  const particles = useMemo<TinyParticle[]>(() => {
    const symbols: Array<"0" | "1" | "$"> = ["0", "1", "$"];
    const seeded = Array.from({ length: 130 }, (_, index) => {
      const seed = index + 1;
      const left = (seed * 53) % 100;
      const top = (seed * 37) % 100;
      const opacity = 0.13 + ((seed * 29) % 18) / 100;
      const size = 9 + ((seed * 17) % 4);
      const delay = ((seed * 11) % 100) / 10;
      const duration = 9 + ((seed * 19) % 8);

      return {
        id: `particle-${seed}`,
        glyph: symbols[seed % symbols.length],
        left,
        top,
        opacity,
        size,
        delay,
        duration,
      };
    });

    return seeded;
  }, []);

  return (
    <section className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.17em] text-fuchsia-100/90">
            <Radar className="h-3.5 w-3.5" />
            Product Surface
          </span>
          <h2 className="mt-4 max-w-3xl font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            One command center for events, quests, player momentum, and reward loops.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          onMouseMove={(event) => {
            const box = revealRef.current;
            if (!box) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            box.style.setProperty("--mx", `${x}px`);
            box.style.setProperty("--my", `${y}px`);
            box.style.setProperty("--hover", "1");
          }}
          onMouseLeave={() => {
            const box = revealRef.current;
            if (!box) return;
            box.style.setProperty("--hover", "0");
            box.style.setProperty("--mx", "50%");
            box.style.setProperty("--my", "40%");
          }}
          onMouseEnter={() => {
            const box = revealRef.current;
            if (!box) return;
            box.style.setProperty("--hover", "1");
          }}
          className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950"
        >
          <div className="absolute inset-0 opacity-60">
            <LaserFlow
              color="#d4b5ff"
              horizontalBeamOffset={0.08}
              verticalBeamOffset={0}
              horizontalSizing={0.52}
              verticalSizing={1.8}
              wispDensity={0.9}
              wispSpeed={12}
              wispIntensity={3.6}
              flowSpeed={0.27}
              flowStrength={0.2}
              fogIntensity={0.42}
              fogScale={0.3}
              fogFallSpeed={0.58}
              decay={1.08}
              falloffStart={1.14}
              className="opacity-70"
            />
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_15%_0%,rgba(8,47,73,0.55),transparent_50%),linear-gradient(170deg,rgba(2,6,23,0.2),rgba(2,6,23,0.9)_65%)]" />

          <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <span
                key={particle.id}
                className="absolute select-none font-mono text-cyan-100/80 transition-all duration-200 ease-out"
                style={
                  {
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    fontSize: `${particle.size}px`,
                    opacity: particle.opacity,
                    transform: "translate(-50%, -50%)",
                    animation: `hqParticleFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                    textShadow:
                      "0 0 calc(1px + (var(--hover, 0) * 8px)) rgba(125, 211, 252, calc(0.16 + (var(--hover, 0) * 0.65))), 0 0 calc(3px + (var(--hover, 0) * 16px)) rgba(217, 70, 239, calc(0.12 + (var(--hover, 0) * 0.45)))",
                    color: particle.glyph === "$" ? "rgba(244, 114, 182, 0.9)" : "rgba(207, 250, 254, 0.9)",
                  } as React.CSSProperties
                }
              >
                {particle.glyph}
              </span>
            ))}
          </div>

          <div
            ref={revealRef}
            className="absolute inset-0"
            style={
              {
                backgroundImage: normalGlow,
              } as React.CSSProperties
            }
          />

          <div
            className="absolute inset-0"
            style={
              {
                backgroundImage:
                  "radial-gradient(220px circle at var(--mx, 50%) var(--my, 40%), rgba(244, 114, 182, 0.23), rgba(14, 165, 233, 0.16) 42%, rgba(2, 6, 23, 0) 72%)",
                opacity: "var(--hover, 0)",
                transition: "opacity 160ms ease",
              } as React.CSSProperties
            }
          />

          <div className="relative z-10 grid gap-6 p-4 sm:p-8 lg:grid-cols-[1.35fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur-xl sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/80">Live Control Room</p>
                  <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">HackQuest Event Matrix</h3>
                </div>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100">
                  Synced
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Active Event</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">Midnight Build Sprint</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Players Online</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">1,284 concurrent</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Quest Completion</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">72.6% milestone clear</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Rewards Issued</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">340 NFTs / 28k XP</p>
                </div>
              </div>

              <div className="mt-4 h-28 rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(14,165,233,0.08),rgba(168,85,247,0.02))] p-3">
                <div className="flex h-full items-end gap-2">
                  {[38, 45, 43, 57, 61, 68, 74, 72, 80, 86, 91, 88].map((height, index) => (
                    <span
                      key={`${height}-${index}`}
                      className="w-full rounded-sm bg-gradient-to-t from-cyan-300/60 to-fuchsia-300/70"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-5 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-fuchsia-100/80">Visibility First</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  The surface stays readable at all times. Hover adds focused glow around the pointer instead of hiding details behind heavy masks.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-5 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-100/80">Interaction Layer</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  LaserFlow provides depth and motion while the content panel stays priority one for serious users.
                </p>
                <Link
                  href="/dashboard/overview"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-100"
                >
                  Enter Dashboard
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-4">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Hover anywhere on this panel
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
