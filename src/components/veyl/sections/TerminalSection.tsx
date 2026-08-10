import { motion } from "motion/react";
import { SectionHeading, UIWindow, StatusIndicator } from "../ui-kit";
import { Terminal } from "../Terminal";

const bars = [
  ["timeout after 30000ms", 412],
  ["ECONNREFUSED 10.0.0.9", 188],
  ["invalid session token", 97],
  ["disk write failed", 24],
];

export function TerminalSection() {
  const max = Math.max(...bars.map(([, n]) => n as number));

  return (
    <section className="relative border-t border-ink-2 bg-ink-0 px-6 py-32 md:px-14">
      <SectionHeading index="04" label="terminal" className="mb-16" />
      <div className="grid gap-8 lg:grid-cols-2">
        <UIWindow
          title="zsh — veyl"
          right={<StatusIndicator label="/var/log" />}
          bodyClassName="min-h-[300px]"
        >
          <Terminal
            command={'grep "ERROR" server.log | sort | uniq -c'}
            output={[
              "    412  ERROR timeout after 30000ms",
              "    188  ERROR ECONNREFUSED 10.0.0.9",
              "     97  ERROR invalid session token",
              "     24  ERROR disk write failed",
            ]}
          />
        </UIWindow>

        <UIWindow title="explained" bodyClassName="min-h-[300px] p-6">
          <div className="space-y-5">
            {bars.map(([label, n], i) => (
              <div key={label as string}>
                <div className="flex items-baseline justify-between font-mono text-[11px]">
                  <span className="text-foreground/85">{label}</span>
                  <span className="text-muted-foreground">{n}</span>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: (n as number) / max }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 1, delay: 1.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-2 h-px origin-left bg-veyl"
                />
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-sm font-mono text-[12px] leading-relaxed text-muted-foreground">
            The terminal is still there. Veyl just shows you what it said.
          </p>
        </UIWindow>
      </div>
    </section>
  );
}