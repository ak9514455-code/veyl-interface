import { submitWaitlist, getWaitlistCount } from "./waitlist.functions";

export type WaitlistResult = { ok: true } | { ok: false; error: string };

export async function joinWaitlist(email: string): Promise<WaitlistResult> {
  try {
    return await submitWaitlist({ data: { email } });
  } catch {
    return { ok: false, error: "Couldn't reach the list. Try again." };
  }
}

export async function fetchWaitlistCount(): Promise<number> {
  try {
    const r = await getWaitlistCount();
    return r.count;
  } catch {
    return 0;
  }
}
