import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import ASCIIText from "@/components/reactbits/ASCIIText";

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
      <h2 className="sr-only">
        The things you don&apos;t notice are usually the things worth noticing.
      </h2>
      <motion.div
        aria-hidden
        style={reduced ? {} : { x }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.4 }}
        className="h-[46vh] min-h-[280px] w-full"
      >
        <ASCIIText
          text="worth noticing"
          asciiFontSize={7}
          textFontSize={180}
          planeBaseHeight={7}
          enableWaves={!reduced}
          textColor="#EDEDF2"
        />
      </motion.div>
    </section>
  );
}