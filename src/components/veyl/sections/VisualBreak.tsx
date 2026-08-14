import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export function VisualBreak() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-ink-0 px-6 md:px-14"
    >
      <motion.h2
        style={reduced ? {} : { x }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.4 }}
        className="veyl-display max-w-6xl text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95]"
      >
        The things you don&apos;t notice are usually
        <span className="text-veyl-soft"> the things worth noticing.</span>
      </motion.h2>
    </section>
  );
}