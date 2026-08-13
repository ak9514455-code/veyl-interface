import { submitWaitlist } from "./waitlist.functions";

export type WaitlistResult = { ok: true } | { ok: false; error: string };

export async function joinWaitlist(email: string): Promise<WaitlistResult> {
  try {
    return await submitWaitlist({ data: { email } });
  } catch {
    return { ok: false, error: "Couldn't reach the list. Try again." };
  }
}
