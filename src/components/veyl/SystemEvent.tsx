import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type VeylEvent = {
  time: string;
  label: string;
  detail: string;
  meta: string;
};

export function SystemEvent({
  event,
  index,
  active = true,
  className,
}: {
  event: VeylEvent;
  index: number;
  active?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: active ? 1 : 0.35, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.7, delay: index * 0.35, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      className={cn(
        "group relative cursor-default border-l border-ink-3 py-3 pl-5 outline-none",
        "focus-visible:border-veyl hover:border-veyl",
        className,
      )}
    >
      <div className="font-mono text-[11px] text-muted-foreground">{event.time}</div>
      <div className="mt-1 font-mono text-sm text-foreground/90">{event.label}</div>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="pt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
          <div>{event.detail}</div>
          <div className="mt-1 text-veyl-soft">{event.meta}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}