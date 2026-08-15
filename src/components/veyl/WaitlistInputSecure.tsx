import { useState, type FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { joinWaitlist } from "@/lib/waitlist";
import ElectricBorder from "@/components/reactbits/ElectricBorder";
import GridScan from "@/components/reactbits/GridScan";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter an email.")
  .email("That email doesn't look right.")
  .max(255, "That email is too long.");

type State = "idle" | "loading" | "success" | "error";

export default function WaitlistInputSecure() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const panelRef = useRef<HTMLDivElement | null>(null);

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

    try {
      const result = await joinWaitlist(parsed.data);
      if (result.success) {
        setState("success");
      } else {
        setState("error");
        if (result.reason === "already_joined") setMessage("You're already on the list.");
        else if (result.reason === "invalid_email") setMessage("Enter a valid email.");
        else setMessage("Something went wrong. Try again.");
      }
    } catch (err) {
      console.error(err);
      setState("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <div className="relative w-full max-w-lg">
      {/* cinematic backdrop */}
      <div className="absolute inset-0 -z-10">
        <GridScan className="h-full w-full" linesColor="#0b1220" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto overflow-hidden rounded-2xl border border-white/6 bg-black/60 backdrop-blur-md p-6 shadow-2xl"
        style={{ boxShadow: '0 12px 40px rgba(3,6,10,0.8)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold leading-tight text-[#E6EFE6]">Request access to VEYL</h3>
            <p className="mt-2 text-sm text-[#AAB5AA] max-w-md">Secure early access — your email is stored safely and never shared. Join the waitlist.</p>
          </div>

          {/* privacy badge */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2C9.2 2 7 4.2 7 7v3H6a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2h-1V7c0-2.8-2.2-5-5-5z" stroke="#9FD9A7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-mono text-[#9FD9A7]">Privacy-first</span>
            </div>
            <span className="mt-2 text-[11px] text-[#6F7A6F]">No tracking · Encrypted</span>
          </div>
        </div>

        <div className="mt-5">
          <AnimatePresence mode="wait">
            {state === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-white/8 bg-gradient-to-b from-[#07100b] to-[#0b1510] p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0E2418] ring-1 ring-white/6">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M20 6L9 17l-5-5" stroke="#9FD9A7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#E6EFE6]">You're on the list</div>
                    <div className="mt-1 text-[13px] text-[#9AA89A]">Check your inbox — we’ll email when access opens.</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1">
                  <label htmlFor="veyl-email" className="sr-only">Email</label>
                  <div className="relative">
                    <input
                      id="veyl-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
                      placeholder="name@company.com"
                      autoComplete="email"
                      disabled={state === 'loading'}
                      aria-invalid={state === 'error'}
                      className="w-full rounded-lg bg-white/3 border border-white/6 px-3 py-2 text-sm text-[#E6EFE6] placeholder:text-[#98A698] focus:outline-none focus:ring-2 focus:ring-[#7C9F7B]"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8" stroke="#6F7A6F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 8V6a5 5 0 0110 0v2" stroke="#6F7A6F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-2 h-4 text-xs font-mono text-destructive">
                    {state === 'error' ? message : ''}
                  </div>
                </div>

                <ElectricBorder color="#5EA37A" speed={0.6} chaos={0.02} borderRadius={10}>
                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="inline-flex items-center gap-2 rounded-md bg-[#90CFA1] px-4 py-2 text-xs font-semibold text-black shadow-sm disabled:opacity-60"
                  >
                    {state === 'loading' ? (
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#051006" strokeWidth="3" opacity="0.2" />
                        <path d="M22 12a10 10 0 00-10-10" stroke="#051006" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <span className="font-mono">Join waitlist</span>
                    )}
                  </button>
                </ElectricBorder>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 text-[12px] text-[#8E9A8E]">By joining you agree to our <span className="underline">privacy policy</span>. We only use your email for access updates.</div>
      </motion.div>
    </div>
  );
}
