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
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(command.slice(0, i));
      if (i >= command.length) {
        clearInterval(t);
        output.forEach((_, idx) => setTimeout(() => setLines(idx + 1), 220 * (idx + 1)));
      }
    }, 28);
    return () => clearInterval(t);
  }, [inView, command, output, reduced]);

  return (
    <div ref={ref} className="px-5 py-5 font-mono text-[13px] leading-7">
      <div className="flex gap-2">
        <span className="text-veyl-soft">{prompt}</span>
        <span className="text-foreground/90">
          {typed}
          <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 animate-pulse bg-veyl" />
        </span>
      </div>
      <div className="mt-3 space-y-1">
        {output.slice(0, lines).map((line) => (
          <div key={line} className="text-muted-foreground">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}