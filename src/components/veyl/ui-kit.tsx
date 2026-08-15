import { forwardRef, type ButtonHTMLAttributes, type ReactNode, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/* ---------------- Button (magnetic) ---------------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
  magnetic?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "outline", magnetic = false, children, ...props },
  ref,
) {
  const inner = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      onMouseMove={(e) => {
        if (!magnetic || reduced) return;
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setOffset({
          x: (e.clientX - (r.left + r.width / 2)) * 0.25,
          y: (e.clientY - (r.top + r.height / 2)) * 0.35,
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={cn(
        "group relative inline-flex items-center gap-3 rounded-xs px-5 py-2.5 font-mono text-xs tracking-[0.14em] uppercase",
        "transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "solid" && "bg-foreground text-background hover:bg-veyl-soft",
        variant === "outline" &&
          "border border-ink-3 text-foreground hover:border-veyl hover:bg-veyl/8",
        variant === "ghost" && "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...(props as Record<string, unknown>)}
    >
      <span ref={inner}>{children}</span>
    </motion.button>
  );
});

/* ---------------- Badge ---------------- */

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-xs border border-ink-3 bg-ink-1/60 px-2.5 py-1",
        "font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- StatusIndicator ---------------- */

export function StatusIndicator({
  label,
  tone = "idle",
  className,
}: {
  label: string;
  tone?: "idle" | "active" | "alert";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-mono text-[11px]", className)}>
      <span className="relative flex h-1.5 w-1.5">
        {tone !== "idle" && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              tone === "active" ? "bg-veyl" : "bg-destructive",
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-1.5 w-1.5 rounded-full",
            tone === "idle" && "bg-ink-4",
            tone === "active" && "bg-veyl",
            tone === "alert" && "bg-destructive",
          )}
        />
      </span>
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

/* ---------------- SectionHeading ---------------- */

export function SectionHeading({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="font-mono text-[11px] text-veyl-soft">{index}</span>
      <span className="veyl-label">{label}</span>
      <span className="h-px flex-1 bg-ink-3" />
    </div>
  );
}

/* ---------------- UIWindow ---------------- */

export function UIWindow({
  title,
  right,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 220, damping: 18, mass: 0.9 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 18, mass: 0.9 });
  const scale = useSpring(1, { stiffness: 220, damping: 18, mass: 0.8 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    rotateX.set(py * -12);
    rotateY.set(px * 12);
    x.set((px * 18));
    y.set((py * 18));
    scale.set(1.012);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
    scale.set(1);
  }

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        x,
        y,
        transformPerspective: 900,
      }}
      className={cn(
        "group relative overflow-hidden rounded-[18px] border border-[#42f08a]/20 bg-[#09110c]/90",
        "shadow-[0_0_0_1px_rgba(90,255,150,0.08),0_30px_80px_-28px_rgba(0,0,0,0.95)]",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(92,255,149,0.12),transparent_55%)] before:content-['']",
        className,
      )}
    >
      <div className="relative flex items-center justify-between border-b border-[#5ff39a]/12 bg-[#0d1711]/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9feeb6]/70">
            {title}
          </span>
        </div>
        {right}
      </div>
      <div className={cn("relative bg-[linear-gradient(180deg,rgba(7,13,9,0.94),rgba(6,11,8,0.8))]", bodyClassName)}>{children}</div>
    </motion.div>
  );
}