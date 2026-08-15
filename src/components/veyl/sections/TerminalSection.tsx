import { motion } from "motion/react";
import TiltedCard from "@/components/reactbits/TiltedCard";
import "@/components/reactbits/TiltedCard.css";
import { SectionHeading, UIWindow, StatusIndicator } from "../ui-kit";
import { Terminal } from "../Terminal";

const matrixArt = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#06130a"/>
      <stop offset="100%" stop-color="#0a160f"/>
    </linearGradient>
  </defs>
  <rect width="800" height="520" fill="url(#g)"/>
  <g opacity="0.9" fill="#6df6a3">
    <g font-family="monospace" font-size="18" letter-spacing="2">
      <text x="40" y="80">01010110 01000101 01011001 01001100</text>
      <text x="40" y="120">secure.feed//signal</text>
      <text x="40" y="160">monitoring...</text>
      <text x="40" y="200">access: verified</text>
      <text x="40" y="240">latency: 42ms</text>
      <text x="40" y="280">threats: 0</text>
    </g>
    <g stroke="#5df59a" stroke-opacity="0.35">
      <path d="M0 360H800"/>
      <path d="M0 400H800"/>
      <path d="M0 440H800"/>
      <path d="M120 0V520"/>
      <path d="M260 0V520"/>
      <path d="M400 0V520"/>
      <path d="M540 0V520"/>
      <path d="M680 0V520"/>
    </g>
  </g>
  <g fill="none" stroke="#5df59a" stroke-width="1.5" stroke-opacity="0.8">
    <path d="M70 120C140 90 180 110 220 140C260 170 300 210 370 190C440 170 470 120 540 110C600 100 640 120 700 172"/>
    <path d="M60 250C120 230 150 255 210 290C270 325 320 330 390 312C470 292 520 236 560 236C610 236 650 256 720 294"/>
  </g>
</svg>
`)}`;

const bars = [
  ["timeout after 30000ms", 412],
  ["ECONNREFUSED 10.0.0.9", 188],
  ["invalid session token", 97],
  ["disk write failed", 24],
];

export function TerminalSection() {
  const max = Math.max(...bars.map(([, n]) => n as number));

  return (
    <section className="relative border-t border-[#1b2e22] bg-[#050b07] px-6 py-32 md:px-14">
      <SectionHeading index="04" label="terminal" className="mb-16" />
      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
        <UIWindow
          title="zsh — veyl"
          right={<StatusIndicator label="secure feed" tone="active" className="text-[#a7f5bf]" />}
          bodyClassName="min-h-[360px]"
        >
          <div className="relative overflow-hidden px-4 py-4">
            <div className="mb-3 flex items-center justify-between border-b border-[#6af29a]/15 pb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#9feeb6]/70">
              <span>secure feed</span>
              <span>runtime://security-scan</span>
            </div>
            <Terminal
              command={'grep "ERROR" server.log | sort | uniq -c'}
              output={[
                "[ 412 ERROR timeout after 30000ms]",
                "[ 188 ERROR ECONNREFUSED 10.0.0.9]",
                "[ 97 ERROR invalid session token]",
                "[ 24 ERROR disk write failed]",
              ]}
            />
          </div>
        </UIWindow>

        <UIWindow title="telemetry" bodyClassName="min-h-[360px] p-5">
          <div className="mb-5">
            <TiltedCard
              imageSrc={matrixArt}
              altText="VEYL secure signal"
              captionText="VEYL // secure.feed"
              containerHeight="240px"
              containerWidth="100%"
              imageHeight="220px"
              imageWidth="100%"
              rotateAmplitude={10}
              scaleOnHover={1.08}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
              overlayContent={
                <div className="flex h-full w-full items-end justify-start p-4">
                  <div className="rounded-full border border-[#7ef5a9]/60 bg-[#08140d]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.26em] text-[#dfffe8]">
                    secure.feed
                  </div>
                </div>
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "active probes", value: "22", accent: "#7ef5a9" },
              { label: "signal integrity", value: "98.4%", accent: "#8ad9ff" },
              { label: "blocked events", value: "403", accent: "#f5d56c" },
              { label: "latency", value: "42ms", accent: "#d1ffa3" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#3a5e4a]/40 bg-[#0b1610]/90 p-3 shadow-[inset_0_0_0_1px_rgba(130,255,180,0.03)]"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8cc99f]/60">
                  {item.label}
                </div>
                <div className="mt-3 font-mono text-2xl text-[#f0fff1]" style={{ color: item.accent }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-5 rounded-xl border border-[#2e4d3a]/50 bg-[#07120d]/80 p-4">
            {bars.map(([label, n], i) => (
              <div key={label as string}>
                <div className="mb-2 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#d7fce2]/80">{label}</span>
                  <span className="text-[#86cba3]">{n}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#0e1c14]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(n as number / max) * 100}%` }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 1, delay: 0.35 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-[linear-gradient(90deg,#5ff39a,#baf7c8)] shadow-[0_0_18px_rgba(95,243,154,0.35)]"
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 max-w-sm font-mono text-[12px] leading-relaxed text-[#9fceb0]/75">
            The terminal is still there. Veyl just shows you what it said.
          </p>
        </UIWindow>
      </div>
    </section>
  );
}