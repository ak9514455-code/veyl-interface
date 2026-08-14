import nodemailer from "nodemailer";

function writeDevEmail(to: string, subject: string, html: string) {
  return (async () => {
    const p = await import("path");
    const fs = await import("fs");
    const dir = p.resolve(process.cwd(), "tmp", "emails");
    await fs.promises.mkdir(dir, { recursive: true });
    const filename = `${Date.now()}-${subject.replace(/\s+/g, "-").toLowerCase()}-${to.replace(/[^a-z0-9@.]/gi, "_")}.html`;
    const out = p.resolve(dir, filename);
    await fs.promises.writeFile(out, `Subject: ${subject}\nTo: ${to}\n\n${html}`);
    console.log(`[DEV_EMAIL] wrote email to ${out}`);
    return true;
  })();
}

async function sendViaSmtp(to: string, subject: string, html: string) {
  const host = process.env["MAIL_HOST"];
  const port = Number(process.env["MAIL_PORT"] ?? "587");
  const user = process.env["MAIL_USER"];
  const pass = process.env["MAIL_PASS"];
  const from = process.env["EMAIL_FROM"];

  if (!host || !user || !pass || !from) {
    throw new Error("Missing SMTP config: MAIL_HOST, MAIL_USER, MAIL_PASS, and EMAIL_FROM");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({ from, to, subject, html });
  return true;
}

async function sendViaResend(to: string, subject: string, html: string) {
  const RESEND_API_KEY = process.env["RESEND_API_KEY"];
  const EMAIL_FROM = process.env["EMAIL_FROM"];

  if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
  if (!EMAIL_FROM) throw new Error("Missing EMAIL_FROM");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error("resend send failed: " + res.status + " " + text);
  }

  return true;
}

async function dispatchEmail(to: string, subject: string, html: string) {
  const smtpConfigured = Boolean(
    process.env["MAIL_HOST"] && process.env["MAIL_USER"] && process.env["MAIL_PASS"] && process.env["EMAIL_FROM"],
  );
  const resendConfigured = Boolean(process.env["RESEND_API_KEY"] && process.env["EMAIL_FROM"]);

  if (process.env["DEV_EMAIL_MODE"] === "true") {
    await writeDevEmail(to, subject, html);
    return true;
  }

  if (smtpConfigured) {
    return sendViaSmtp(to, subject, html);
  }

  if (resendConfigured) {
    return sendViaResend(to, subject, html);
  }

  throw new Error("No active email provider configured. Set SMTP or Resend env vars.");
}

export async function sendWaitlistConfirmation(email: string) {
  const subject = "You're in — VEYL";
  const html = `
  <div style="background:#050606;color:#F1F3F1;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#0D110E;padding:24px;border-radius:6px;">
      <h1 style="margin:0 0 12px 0;font-size:20px">VEYL</h1>
      <hr style="border:none;border-top:1px solid #222;margin:12px 0" />
      <h2 style="font-size:18px;margin:8px 0 12px 0">YOU'RE IN.</h2>
      <p style="color:#F1F3F1;line-height:1.4;margin:8px 0">Thanks for joining the VEYL early-access list.</p>
      <p style="color:#777D78;line-height:1.4;margin:8px 0">We're building VEYL quietly. You'll hear from us when access opens.</p>
      <p style="color:#6FAF72;font-weight:600;margin:16px 0">SEE YOU INSIDE.</p>
      <hr style="border:none;border-top:1px solid #222;margin:12px 0" />
      <p style="font-size:12px;color:#777D78;margin:8px 0">VEYL / EARLY ACCESS</p>
    </div>
  </div>
  `;

  return dispatchEmail(email, subject, html);
}

export async function sendAdminWaitlistNotification(email: string, createdAt: string) {
  const ADMIN = process.env["WAITLIST_ADMIN_EMAIL"];
  if (!ADMIN) throw new Error("Missing WAITLIST_ADMIN_EMAIL");

  const subject = "New VEYL waitlist signup";
  const created = new Date(createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });

  const html = `
  <div style="background:#050606;color:#F1F3F1;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#0D110E;padding:24px;border-radius:6px;">
      <h1 style="margin:0 0 12px 0;font-size:18px">VEYL / WAITLIST</h1>
      <h2 style="font-size:16px;margin:6px 0 12px 0">NEW ACCESS REQUEST</h2>
      <hr style="border:none;border-top:1px solid #222;margin:12px 0" />
      <p style="font-family:monospace;color:#F1F3F1;margin:8px 0"><strong>EMAIL</strong><br />${email}</p>
      <p style="font-family:monospace;color:#F1F3F1;margin:8px 0"><strong>JOINED</strong><br />${created}</p>
      <hr style="border:none;border-top:1px solid #222;margin:12px 0" />
      <p style="font-size:12px;color:#777D78;margin:8px 0">VEYL<br/>EARLY ACCESS</p>
    </div>
  </div>
  `;

  return dispatchEmail(ADMIN, subject, html);
}

