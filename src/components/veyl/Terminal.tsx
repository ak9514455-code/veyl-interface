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
        output.forEach((_, idx) => {
          const delay = 180 + idx * 150;
          window.setTimeout(() => setLines((current) => Math.max(current, idx + 1)), delay);
        });
        return;
      }

      const char = command.charAt(index - 1);
      const base = 18;
      const extra = char === " " ? 8 : /[.,;:!\-]/.test(char) ? 130 : 0;
      window.setTimeout(() => {
        if (!stopped) requestAnimationFrame(step);
      }, base + extra);
    }

    requestAnimationFrame(step);
    return () => {
      stopped = true;
    };
  }, [inView, command, output, reduced]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden px-5 py-5 font-mono text-[13px] leading-7 text-[#d8f9dc]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(95,255,154,0.04),transparent_30%,rgba(95,255,154,0.02))]" />
      <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,transparent,rgba(88,255,149,0.08),transparent)] opacity-70 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]" />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#93e8a8]/65">
          <span className="relative h-1.5 w-1.5 rounded-full bg-[#69f39b] shadow-[0_0_12px_rgba(105,243,155,0.8)]">
            <span className="absolute inset-0 rounded-full bg-[#69f39b] animate-ping" />
          </span>
          runtime://security-scan
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7bf5ab]">{prompt}</span>
          <span className="tracking-tight text-[#ebfff0]">
            <span style={{ whiteSpace: "pre" }}>{typed}</span>
            <span className="cyber-cursor ml-0.5 inline-block h-4 w-[8px] translate-y-0.5 bg-[#7bf5ab] shadow-[0_0_10px_rgba(123,245,171,0.9)]" />
          </span>
        </div>

        <div className="mt-4 space-y-1 border-l border-[#6af29a]/20 pl-3">
          {output.slice(0, lines).map((line, idx) => (
            <div
              key={`${idx}-${line}`}
              className="terminal-line text-[#9ae7ad] opacity-0"
              style={{ animationDelay: `${0.06 * idx}s`, animationFillMode: "forwards" }}
            >
              <span className="mr-2 text-[#66d48d]">[</span>
              {line}
              <span className="ml-2 text-[#66d48d]">]</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes cyberCursor {
          0%, 10% { opacity: 1; transform: translateY(0) scaleY(1); filter: brightness(1.2); }
          12%, 14% { opacity: 0.9; transform: translateY(-1px) scaleY(1.08); }
          15%, 48% { opacity: 1; transform: translateY(0) scaleY(1); }
          49%, 50% { opacity: 0.12; transform: translateY(1px) scaleY(0.92); }
          51%, 100% { opacity: 0.15; transform: translateY(0) scaleY(1); }
        }
        @keyframes cyberCursorGlow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(123,245,171,0.3), 0 0 10px rgba(123,245,171,0.85), 0 0 18px rgba(123,245,171,0.6); }
          50% { box-shadow: 0 0 0 1px rgba(123,245,171,0.7), 0 0 18px rgba(123,245,171,1), 0 0 30px rgba(123,245,171,0.9); }
        }
        @keyframes terminalLine {
          0% { opacity: 0; transform: translateX(-4px); filter: blur(1px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        .cyber-cursor {
          position: relative;
          display: inline-block;
          height: 1rem;
          width: 0.5rem;
          border-radius: 2px;
          background: linear-gradient(180deg, rgba(182,255,206,1) 0%, rgba(123,245,171,1) 48%, rgba(95,255,155,0.7) 100%);
          box-shadow: 0 0 0 1px rgba(123,245,171,0.35), 0 0 12px rgba(123,245,171,0.9), 0 0 18px rgba(123,245,171,0.55);
          animation: cyberCursor 1s steps(1) infinite, cyberCursorGlow 1.5s ease-in-out infinite;
        }
        .cyber-cursor::before {
          content: "";
          position: absolute;
          inset: -4px 1px -4px 1px;
          border-radius: 3px;
          background: linear-gradient(180deg, rgba(123,245,171,0.25), rgba(123,245,171,0));
          opacity: 0.8;
          filter: blur(6px);
        }
        .terminal-line { animation: terminalLine 220ms ease-out forwards; }
      `}</style>
    </div>
  );
}