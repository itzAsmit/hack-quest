"use client";

import { cn } from "@/lib/utils";

interface NeonBadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "gold" | "success" | "danger" | "slate";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const variantStyles = {
  purple: "bg-hq-accent-purple/20 text-hq-accent-glow border-hq-accent-purple/40",
  gold: "bg-hq-gold/20 text-hq-gold-light border-hq-gold/40",
  success: "bg-white/10 text-white border-white/20",
  danger: "bg-hq-accent-purple/10 text-hq-accent-purple border-hq-accent-purple/20",
  slate: "bg-white/5 text-hq-text-secondary border-white/10",
};

const sizeStyles = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
  lg: "text-sm px-3 py-1.5",
};

export function NeonBadge({
  children,
  variant = "purple",
  size = "md",
  pulse = false,
  className,
}: NeonBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium uppercase tracking-wider",
        variantStyles[variant],
        sizeStyles[size],
        pulse && "animate-glow-pulse",
        className
      )}
    >
      {children}
    </span>
  );
}
