"use client";

import React from "react";
import { cn } from "@/lib/utils";

type GlassPanelProps<C extends React.ElementType> = {
  as?: C;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
} & React.ComponentPropsWithoutRef<C>;

export function GlassPanel<C extends React.ElementType = "div">({
  children,
  className,
  hover = false,
  as,
  ...props
}: GlassPanelProps<C>) {
  const Component = as || "div";
  return (
    <Component
      className={cn(
        hover ? "glass-panel-hover" : "glass-panel",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
