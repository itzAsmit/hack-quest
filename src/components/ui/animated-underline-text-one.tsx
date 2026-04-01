"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  textClassName?: string;
  underlineClassName?: string;
  underlinePath?: string;
  underlineHoverPath?: string;
  underlineDuration?: number;
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      textClassName,
      underlineClassName,
      underlinePath = "M 0,10 Q 75,0 150,10 Q 225,20 300,10",
      underlineHoverPath = "M 0,10 Q 75,20 150,10 Q 225,0 300,10",
      underlineDuration = 1.5,
      ...props
    },
    ref
  ) => {
    // Split text into characters for staggered animation
    const characters = text.split("");

    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.04,
          delayChildren: 0.2,
        },
      },
    };

    const charVariants: Variants = {
      hidden: { 
        y: 60, 
        opacity: 0,
        rotateX: -90,
        filter: "blur(10px)",
      },
      visible: {
        y: 0,
        opacity: 1,
        rotateX: 0,
        filter: "blur(0px)",
        transition: {
          duration: 1.2,
          ease: [0.2, 0.65, 0.3, 0.9], // Custom cubic bezier for smooth entry
        },
      },
    };

    const pathVariants: Variants = {
      hidden: {
        pathLength: 0,
        opacity: 0,
      },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: underlineDuration,
          ease: [0.6, 0.01, -0.05, 0.95],
          delay: 0.8, // Start underline after letters begin appearing
        },
      },
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center", props.className)}
      >
        <div className="relative pt-8 pb-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              "flex flex-wrap items-center justify-center font-normal text-center tracking-tighter", 
              textClassName
            )}
            style={{ perspective: "1000px" }}
          >
            {characters.map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                variants={charVariants}
                className="inline-block"
                style={{ transformStyle: "preserve-3d" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>

          <motion.svg
            width="100%"
            height="24"
            viewBox="0 0 300 24"
            className={cn("absolute -bottom-2 left-0 w-full transform scale-110", underlineClassName)}
          >
            <motion.path
              d={underlinePath}
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                d: underlineHoverPath,
                transition: { duration: 0.8 },
              }}
            />
          </motion.svg>
        </div>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
