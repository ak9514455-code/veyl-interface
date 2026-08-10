import { motion } from "motion/react";
import { StatusIndicator, UIWindow } from "./ui-kit";
import { cn } from "@/lib/utils";

const modules = [
  "Overview",
  "Privacy",
  "Network",
  "Security",
  "Forensics",
  "OSINT",
  "Lab",
  "Mentor",
  "Terminal",
];

const connections = [
  ["chromium", "185.199.110.153:443", "US", "trusted"],
  ["systemd-resolve", "1.1.1.1:53", "—", "trusted"],
  ["node", "104.18.32.7:443", "DE", "watch"],
  ["curl", "45.83.220.11:8443", "RU", "flagged"],
  ["ssh", "10.0.0.9:22", "LAN", "trusted"],
];

export function VeylEnvironment({
  compact = false,
  activeModule = "Network",
}: {
  compact?: boolean;
  activeModule?: string;
}) {
  return (
    <UIWindow
      title="veyl — session 0x1f"
      right={<StatusIndicator label="live" tone="active" />}
      bodyClassName="grid grid-cols-[140px_1fr] md:grid-cols-[168px_1fr]"
    >
      <aside className="border-r border-ink-3 py-3">
        {modules.map((m) => (
          <div
            key={m}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 font-mono text-[11px] transition-colors",
              m === activeModule
                ? "border-l border-veyl bg-veyl/8 text-foreground"
                : "border-l border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {m}
          </div>
        ))}
      </aside>

      <div className="min-w-0">
        <div className="flex items-center justify-between border-b border-ink-3 px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          <span>outbound connections</span>
          <span>{connections.length} active</span>
        </div>
        <div className="divide-y divide-ink-2">
          {connections.map((row, i) => (
            <motion.div
              key={row[1]}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-2.5 font-mono text-[11px] md:grid-cols-[120px_1fr_48px_84px]"
            >
              <span className="text-foreground/85">{row[0]}</span>
              <span className="truncate text-muted-foreground">{row[1]}</span>
              <span className="hidden text-muted-foreground md:block">{row[2]}</span>
              <span
                className={cn(
                  "justify-self-end",
                  row[3] === "flagged"
                    ? "text-veyl-soft"
                    : row[3] === "watch"
                      ? "text-foreground/70"
                      : "text-muted-foreground",
                )}
              >
                {row[3]}
              </span>
            </motion.div>
          ))}
        </div>

        {!compact && (
          <div className="grid grid-cols-1 border-t border-ink-3 md:grid-cols-3">
            {[
              ["processes", "214", "3 unsigned"],
              ["dns queries", "1,208", "1 unresolved"],
              ["identity leaks", "2", "clipboard, mic"],
            ].map(([k, v, s]) => (
              <div key={k} className="border-ink-3 px-4 py-5 not-last:border-r">
                <div className="veyl-label">{k}</div>
                <div className="veyl-display mt-2 text-3xl">{v}</div>
                <div className="mt-1 font-mono text-[11px] text-veyl-soft">{s}</div>
              </div>
            ))}
          </div>
        )}

        <div className="veyl-hairline flex items-center justify-between px-4 py-2 font-mono text-[10px] text-muted-foreground">
          <span>kernel 6.9.4 · hardened</span>
          <span>capture 00:41:22</span>
        </div>
      </div>
    </UIWindow>
  );
}