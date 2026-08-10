import { motion, useScroll, useTransform } from "motion/react";
import { StatusIndicator } from "./ui-kit";

export function Navigation() {
  const { scrollYProgress } = useScroll();
  const border = useTransform(scrollYProgress, [0, 0.03], [0, 1]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className="group flex items-center gap-3">
          <span className="veyl-display text-sm tracking-[0.42em] text-foreground">VEYL</span>
          <span className="hidden h-3 w-px bg-ink-3 sm:block" />
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase sm:block">
            workstation
          </span>
        </a>
        <nav className="flex items-center gap-6">
          <StatusIndicator label="build 0.4.1 · private" tone="active" className="hidden sm:flex" />
          <a
            href="#waitlist"
            className="font-mono text-[11px] tracking-[0.18em] text-foreground uppercase transition-colors hover:text-veyl-soft"
          >
            Early access
          </a>
        </nav>
      </div>
      <motion.div style={{ scaleX: border, originX: 0 }} className="h-px bg-ink-3" />
    </header>
  );
}