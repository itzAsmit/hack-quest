"use client";

import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
}

export function GlassPanel({
  children,
  className,
  hover = false,
  as: Component = "div",
}: GlassPanelProps) {
  return (
    <Component
      className={cn(
        hover ? "glass-panel-hover" : "glass-panel",
        className
      )}
    >
      {children}
    </Component>
  );
}
