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
        className="veyl-display max-w-5xl text-[9vw] leading-[0.95] md:text-[5.5vw]"
      >
        {["The things you don't notice", "are usually the things", "worth noticing."].map(
          (line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 1.1, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ),
        )}
      </motion.h2>
    </section>
  );
}