import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MentorMessage({
  from,
  children,
  delay = 0,
  className,
}: {
  from: "user" | "veyl";
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex gap-4", className)}
    >
      <span
        className={cn(
          "mt-1 shrink-0 font-mono text-[10px] tracking-[0.18em] uppercase",
          from === "veyl" ? "text-veyl-soft" : "text-muted-foreground",
        )}
      >
        {from === "veyl" ? "veyl" : "you"}
      </span>
      <div
        className={cn(
          "text-[15px] leading-relaxed",
          from === "veyl" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}