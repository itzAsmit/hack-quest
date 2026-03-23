"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ChevronRight, Sparkles } from "lucide-react";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = [
      "124, 58, 237",  // purple
      "168, 85, 247",  // violet
      "192, 132, 252", // glow
      "245, 158, 11",  // gold
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Radial gradient overlays */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-hq-accent-purple/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-hq-accent-violet/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-hq-gold/4 rounded-full blur-[80px]" />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-20 h-20 border border-hq-accent-purple/20 rounded-xl rotate-45 animate-float" />
        <div className="absolute top-[70%] right-[15%] w-14 h-14 border border-hq-accent-violet/15 rounded-full animate-float-delayed" />
        <div className="absolute top-[30%] right-[20%] w-16 h-16 border border-hq-gold/10 rotate-12 animate-float" />
        <div className="absolute bottom-[20%] left-[25%] w-10 h-10 border border-hq-accent-glow/15 rounded-lg rotate-[30deg] animate-float-delayed" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-hq-accent-purple/10 border border-hq-accent-purple/30 rounded-full px-4 py-1.5 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-hq-accent-glow" />
          <span className="text-xs font-medium text-hq-accent-glow uppercase tracking-wider">
            Gamified Hackathon Platform
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-6"
        >
          <span className="block text-hq-text-primary">EARN XP.</span>
          <span className="block gradient-text">COLLECT NFTS.</span>
          <span className="block text-hq-text-primary">
            COMPETE{" "}
            <span className="relative inline-block">
              GLOBALLY
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-hq-accent-purple to-hq-gold rounded-full" />
            </span>
            .
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-hq-text-secondary mb-10 leading-relaxed"
        >
          Join hackathons, earn experience points, collect blockchain-backed NFTs,
          and climb the global leaderboard. Your coding journey, gamified.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/events" className="btn-primary text-base px-8 py-4 flex items-center gap-2 group">
            <Zap className="w-4 h-4" />
            Explore Events
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/register" className="btn-outline text-base px-8 py-4">
            Join Now — It&apos;s Free
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "10K+", label: "Players" },
            { value: "500+", label: "NFTs Minted" },
            { value: "50+", label: "Events" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-heading font-bold text-2xl sm:text-3xl gradient-text-gold">
                {value}
              </p>
              <p className="text-xs sm:text-sm text-hq-text-muted uppercase tracking-wider mt-1">
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-hq-bg-primary to-transparent z-[2]" />
    </section>
  );
}
