export type WaitlistResult = { ok: true } | { ok: false; error: string };

/**
 * Single submission entry point. Swap the body for a Lovable Cloud insert
 * (or a server function) later — the calling UI does not change.
 */
export async function joinWaitlist(email: string): Promise<WaitlistResult> {
  try {
    await new Promise((r) => setTimeout(r, 900));
    if (!email.includes("@")) return { ok: false, error: "That email doesn't look right." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't reach the list. Try again." };
  }
}