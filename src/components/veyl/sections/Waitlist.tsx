import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { WaitlistInput } from "../WaitlistInput";
import { StatusIndicator } from "../ui-kit";
import { fetchWaitlistCount } from "@/lib/waitlist";

const MANIFEST = [
  ["01", "Early access", "First build, before public release."],
  ["02", "Founding pricing", "Locked for the lifetime of the account."],
  ["03", "Direct line", "Shape the modules with the people building them."],
] as const;

function Counter({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (value <= 0) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{String(shown).padStart(4, "0")}</>;
}

export function Waitlist() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let alive = true;
    fetchWaitlistCount().then((c) => {
      if (alive) setCount(c);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      id="waitlist"
      className="relative flex min-h-screen flex-col justify-between border-t border-ink-2 bg-ink-0 px-6 py-16 md:px-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--color-veyl)_14%,transparent),transparent_70%)]"
      />

      <div className="relative flex flex-1 flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid w-full gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end"
        >
          <div className="max-w-2xl">
            <span className="veyl-display text-sm tracking-[0.5em]">VEYL</span>
            <h2 className="veyl-display mt-10 text-7xl md:text-8xl">Be early.</h2>
            <p className="mt-6 max-w-md font-mono text-[12px] leading-relaxed text-muted-foreground">
              Veyl is being built quietly. No launch noise — one message when the
              workstation opens, and nothing else.
            </p>
            <div className="mt-14">
              <WaitlistInput />
            </div>
          </div>

          <div className="border border-ink-2 bg-ink-1/60 p-6 backdrop-blur-sm">
            <div className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              <span>on the list</span>
              <StatusIndicator label="live" />
            </div>
            <p className="veyl-display mt-3 text-5xl tabular-nums text-veyl-soft">
              <Counter value={count} />
            </p>

            <ul className="mt-8 space-y-5">
              {MANIFEST.map(([n, title, desc]) => (
                <li key={n} className="flex gap-4">
                  <span className="mt-[3px] font-mono text-[10px] text-veyl">{n}</span>
                  <span>
                    <span className="block text-sm text-foreground">{title}</span>
                    <span className="mt-1 block font-mono text-[11px] leading-relaxed text-muted-foreground">
                      {desc}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <footer className="veyl-hairline relative flex flex-wrap items-center justify-between gap-4 pt-6 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        <span>VEYL · workstation</span>
        <StatusIndicator label="pre-release" />
        <span>2026</span>
      </footer>
    </section>
  );
}
