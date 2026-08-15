import { submitWaitlist, getWaitlistCount } from "./waitlist.functions";

export type WaitlistResult = { success: true } | { success: false; reason: string };

export async function joinWaitlist(email: string): Promise<WaitlistResult> {
  try {
    return await submitWaitlist({ data: { email } });
  } catch {
    return { success: false, reason: "server_error" };
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
