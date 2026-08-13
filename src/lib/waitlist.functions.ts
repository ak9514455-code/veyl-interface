import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

export const submitWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("waitlist_signups")
      .insert({ email: data.email });

    if (error && error.code !== "23505") {
      console.error("waitlist insert failed", error.message);
      return { ok: false as const, error: "Couldn't reach the list. Try again." };
    }

    return { ok: true as const };
  });
