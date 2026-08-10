import { motion } from "motion/react";
import { WaitlistInput } from "../WaitlistInput";
import { StatusIndicator } from "../ui-kit";

export function Waitlist() {
  return (
    <section
      id="waitlist"
      className="relative flex min-h-screen flex-col justify-between border-t border-ink-2 bg-ink-0 px-6 py-16 md:px-14"
    >
      <div className="flex flex-1 flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="veyl-display text-sm tracking-[0.5em]">VEYL</span>
          <h2 className="veyl-display mt-10 text-7xl md:text-8xl">Be early.</h2>
          <p className="mt-6 font-mono text-[12px] text-muted-foreground">
            Veyl is being built quietly.
          </p>
          <div className="mt-14">
            <WaitlistInput />
          </div>
        </motion.div>
      </div>

      <footer className="veyl-hairline flex flex-wrap items-center justify-between gap-4 pt-6 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        <span>VEYL · workstation</span>
        <StatusIndicator label="pre-release" />
        <span>{new Date().getFullYear()}</span>
      </footer>
    </section>
  );
}