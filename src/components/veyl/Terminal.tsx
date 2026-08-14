import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export function Terminal({
  command,
  output,
  prompt = "$",
}: {
  command: string;
  output: string[];
  prompt?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState("");
  const [lines, setLines] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setTyped(command);
      setLines(output.length);
      return;
    }

    let stopped = false;
    let index = 0;

    function step() {
      if (stopped) return;
      index += 1;
      setTyped(command.slice(0, index));
      if (index >= command.length) {
        // reveal output lines with stagger
        output.forEach((_, idx) => setTimeout(() => setLines(idx + 1), 220 * (idx + 1)));
        return;
      }
      // adaptive speed: pause a bit after punctuation
      const char = command.charAt(index - 1);
      const base = 16;
      const extra = char === ' ' ? 6 : /[.,;:!\-]/.test(char) ? 120 : 0;
      setTimeout(() => requestAnimationFrame(step), base + extra);
    }

    requestAnimationFrame(step);
    return () => {
      stopped = true;
    };
  }, [inView, command, output, reduced]);

  return (
    <div ref={ref} className="px-5 py-5 font-mono text-[13px] leading-7 text-[#B7F5A9]">
      <div className="flex gap-2 items-center">
        <span className="text-[#7ED06A]">{prompt}</span>
        <span className="text-[#B7F5A9] tracking-tight">
          <span style={{ whiteSpace: 'pre' }}>{typed}</span>
          <span className="ml-0.5 inline-block h-4 w-[8px] translate-y-0.5 bg-[#7ED06A] animate-blink" />
        </span>
      </div>

      <div className="mt-3 space-y-1">
        {output.slice(0, lines).map((line, idx) => (
          <div key={`${idx}-${line}`} className="text-[#8FCE84] opacity-0 animate-fade-in" style={{ animationDelay: `${0.06 * idx}s`, animationFillMode: 'forwards' }}>
            {line}
          </div>
        ))}
      </div>

      <style>{`@keyframes blink{0%{opacity:1}50%{opacity:0}100%{opacity:1}} .animate-blink{animation: blink 1s steps(1) infinite}`}</style>
    </div>
  );
}