import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Button, StatusIndicator } from "../ui-kit";
import { VeylEnvironment } from "../VeylEnvironment";

const fragments = [
  { t: "17:02:44  pid 4412  chromium  ESTABLISHED", c: "top-[18%] left-[6%]" },
  { t: "tcp  10.0.0.14:52310 → 185.199.110.153:443", c: "top-[30%] right-[8%]" },
  { t: "dns  telemetry.edge-node.net  A  ttl 60", c: "bottom-[34%] left-[10%]" },
  { t: "51.5074° N, 0.1278° W", c: "top-[62%] right-[12%]" },
  { t: "exec /usr/bin/curl  uid 1000  ppid 1", c: "bottom-[18%] right-[18%]" },
  { t: "sha256 9f2c…41ab  unsigned", c: "top-[46%] left-[3%]" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const typeOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const envY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const envRotate = useTransform(scrollYProgress, [0, 1], [16, 2]);
  const envScale = useTransform(scrollYProgress, [0, 1], [0.94, 1.02]);

  const line = {
    hidden: { y: "110%" },
    show: (i: number) => ({
      y: "0%",
      transition: { duration: 1.1, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <section ref={ref} id="top" className="relative min-h-[190vh] w-full">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* telemetry fragments */}
        <div aria-hidden className="absolute inset-0">
          {fragments.map((f, i) => (
            <motion.span
              key={f.t}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.28 }}
              transition={{ duration: 1.6, delay: 0.8 + i * 0.18 }}
              className={`absolute font-mono text-[10px] tracking-wide text-muted-foreground md:text-[11px] ${f.c}`}
            >
              {f.t}
            </motion.span>
          ))}
          <div className="absolute inset-x-0 top-1/2 h-px bg-ink-2" />
          <div className="absolute inset-y-0 left-[14%] w-px bg-ink-2" />
          <div className="absolute inset-y-0 right-[22%] w-px bg-ink-2" />
        </div>

        <motion.div
          style={reduced ? undefined : { y: typeY, opacity: typeOpacity }}
          className="relative z-10 flex h-full flex-col justify-center px-6 md:px-14"
        >
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="mb-8"
            >
              <StatusIndicator label="not yet released" tone="active" />
            </motion.div>

            <h1 className="veyl-display text-[15vw] leading-[0.86] sm:text-[13vw] md:text-[10.5vw] lg:text-[9rem]">
              {["See what", "others miss."].map((l, i) => (
                <span key={l} className="block overflow-hidden">
                  <motion.span
                    custom={i}
                    variants={line}
                    initial={reduced ? "show" : "hidden"}
                    animate="show"
                    className="block"
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10"
            >
              <Button variant="outline" magnetic asChild={false} onClick={() => {
                document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
              }}>
                Get Early Access
              </Button>
              <p className="max-w-xs font-mono text-[11px] leading-relaxed text-muted-foreground">
                A workstation for visibility, privacy and investigation.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* environment emerging underneath the typography */}
        <motion.div
          style={
            reduced
              ? undefined
              : { y: envY, rotateX: envRotate, scale: envScale, transformPerspective: 1600 }
          }
          className="pointer-events-none absolute inset-x-0 bottom-[-30vh] z-0 mx-auto hidden w-[86%] max-w-6xl md:block"
        >
          <VeylEnvironment compact />
        </motion.div>
      </div>
    </section>
  );
}