import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
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
  return (
    <div
      className={cn(
        "veyl-grain overflow-hidden rounded-sm border border-ink-3 bg-ink-1/90 backdrop-blur-[2px]",
        "shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-ink-3 bg-ink-2/70 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-4" />
          <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            {title}
          </span>
        </div>
        {right}
      </div>
      <div className={cn("relative", bodyClassName)}>{children}</div>
    </div>
  );
}