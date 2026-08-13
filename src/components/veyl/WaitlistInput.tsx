import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { joinWaitlist } from "@/lib/waitlist";
import ElectricBorder from "@/components/reactbits/ElectricBorder";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter an email.")
  .email("That email doesn't look right.")
  .max(255, "That email is too long.");

type State = "idle" | "loading" | "success" | "error";

export function WaitlistInput() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setState("error");
      setMessage(parsed.error.issues[0]?.message ?? "Invalid email.");
      return;
    }
    setState("loading");
    setMessage("");
    const result = await joinWaitlist(parsed.data);
    if (result.ok) {
      setState("success");
    } else {
      setState("error");
      setMessage(result.error);
    }
  }

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait" initial={false}>
        {state === "success" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-veyl/50 pb-3"
          >
            <p className="veyl-display text-3xl">You&apos;re in.</p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              {email} — we&apos;ll be in touch before launch.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <ElectricBorder color="#7C5CFF" speed={0.8} chaos={0.1} borderRadius={12}>
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-3 px-4 py-3"
            >
            <label htmlFor="veyl-email" className="sr-only">
              Email address
            </label>
            <input
              id="veyl-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder="your@email.com"
              autoComplete="email"
              disabled={state === "loading"}
              aria-invalid={state === "error"}
              className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-ink-4 focus:outline-none"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="shrink-0 font-mono text-xs tracking-[0.18em] text-foreground uppercase transition-colors hover:text-veyl-soft focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:text-muted-foreground"
            >
              {state === "loading" ? "···" : "Join"}
            </button>
            </form>
            </ElectricBorder>
          </motion.div>
        )}
      </AnimatePresence>
      <div aria-live="polite" className="mt-3 h-4 font-mono text-[11px] text-destructive">
        {state === "error" ? message : ""}
      </div>
    </div>
  );
}