import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

// Rate limit abstraction (no-op for now; replace with real limiter later)
async function rateLimitKey(_key: string) {
  // Placeholder: implement IP-based or token-based rate limiting here.
  return true;
}

export const submitWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async (ctx: any) => {
    const { data, request } = ctx;
    // Basic rate-limit abstraction: key by IP when available
    try {
      const ip = (request as any)?.headers?.get?.("x-forwarded-for") || (request as any)?.ip || "anon";
      await rateLimitKey(String(ip));
    } catch (e) {
      // ignore rate limit failures for now
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendWaitlistConfirmation, sendAdminWaitlistNotification } = await import("@/lib/email");

    // insert and return the created row so we have created_at
    const { data: inserted, error } = await supabaseAdmin
      .from("waitlist_signups")
      .insert({ email: data.email })
      .select()
      .single();

    if (error) {
      // duplicate
      if (error.code === "23505") {
        return { success: false as const, reason: "already_joined" };
      }
      console.error("waitlist insert failed");
      return { success: false as const, reason: "server_error" };
    }

    // attempt to send emails (failures cause server_error response)
    try {
      await sendWaitlistConfirmation(inserted.email);
      await sendAdminWaitlistNotification(inserted.email, inserted.created_at);
    } catch (e) {
      console.error("waitlist email send failed");
      return { success: false as const, reason: "server_error" };
    }

    return { success: true as const };
  });

export const getWaitlistCount = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin
    .from("waitlist_signups")
    .select("*", { count: "exact", head: true });
  if (error) return { count: 0 };
  return { count: count ?? 0 };
});
