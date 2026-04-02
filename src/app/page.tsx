"use client";

import { useEffect, useState } from "react";
import FramerLanding from "@/components/landing/FramerLanding";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";
import { motion, AnimatePresence } from "framer-motion";

import { useLoading } from "@/components/shared/LoadingProvider";

export default function HomePage() {
  const { hasLoadedOnce, setHasLoadedOnce } = useLoading();
  const [loading, setLoading] = useState(!hasLoadedOnce);

  useEffect(() => {
    if (hasLoadedOnce) return;

    // Artificial delay to show the loading screen properly
    const timer = setTimeout(() => {
      setLoading(false);
      setHasLoadedOnce(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, [hasLoadedOnce]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          <AnimatedText
            text="Namaste Hackers !"
            textClassName="font-[family-name:var(--font-cursive)] text-6xl md:text-8xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] px-8"
            underlineClassName="text-white/30"
            underlineDuration={2.2}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
            className="mt-16 flex items-center gap-4"
          >
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-white/60" />
            <span className="text-[11px] font-medium uppercase tracking-[0.6em] text-white/50">
              Entering the quest engine
            </span>
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-white/60" />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FramerLanding />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
