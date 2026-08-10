import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { SectionHeading } from "../ui-kit";
import { VeylEnvironment } from "../VeylEnvironment";

export function Reveal() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -6]);
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section ref={ref} className="relative border-t border-ink-2 bg-ink-0 px-6 py-28 md:px-14">
      <SectionHeading index="01" label="the environment" className="mb-16" />
      <div className="grid gap-14 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="veyl-display text-4xl md:text-5xl">
            Not a dashboard.
            <br />A place to work.
          </h2>
          <p className="mt-6 max-w-xs font-mono text-[12px] leading-relaxed text-muted-foreground">
            Nine surfaces. One machine. Everything it does, in plain view.
          </p>
        </div>
        <motion.div
          style={reduced ? {} : { rotateX: rotate, y, transformPerspective: 1400 }}
          className="origin-top"
        >
          <VeylEnvironment />
        </motion.div>
      </div>
    </section>
  );
}