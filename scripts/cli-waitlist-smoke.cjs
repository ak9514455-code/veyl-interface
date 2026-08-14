const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const envText = fs.readFileSync(path.resolve('.env.local'), 'utf8');
const env = {};
for (const raw of envText.split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx === -1) continue;
  let key = line.slice(0, idx).trim();
  let val = line.slice(idx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  env[key] = val;
}

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

(async () => {
  const out = { selectCount: 0, inserted: false };
  try {
    const { data, error } = await supabase.from('waitlist_signups').select('*');
    if (error) { out.selectError = { code: error.code, message: error.message }; }
    else { out.selectCount = Array.isArray(data) ? data.length : 0; }

    const testEmail = `cli-test+${Date.now()}@example.com`;
    const { data: ins, error: ierr } = await supabase.from('waitlist_signups').insert({ email: testEmail }).select().single();
    if (ierr) { out.inserted = false; out.insertError = { code: ierr.code, message: ierr.message }; }
    else { out.inserted = true; out.inserted_at = ins.created_at; out.testEmail = testEmail; }

    // send emails via SMTP if configured
    if (env.MAIL_HOST && env.MAIL_USER && env.MAIL_PASS && env.EMAIL_FROM) {
      const transporter = nodemailer.createTransport({ host: env.MAIL_HOST, port: Number(env.MAIL_PORT || 587), secure: Number(env.MAIL_PORT||587)===465, auth: { user: env.MAIL_USER, pass: env.MAIL_PASS } });
      const visitorHtml = `<div style="background:#050606;color:#F1F3F1;padding:24px;"><div style="max-width:600px;margin:0 auto;background:#0D110E;padding:24px;border-radius:6px;"><h2>YOU'RE IN.</h2><p>Thanks for joining VEYL.</p></div></div>`;
      const adminHtml = `<div style="background:#050606;color:#F1F3F1;padding:24px;"><div style="max-width:600px;margin:0 auto;background:#0D110E;padding:24px;border-radius:6px;"><h2>NEW ACCESS REQUEST</h2><p>${testEmail}</p><p>${out.inserted_at||new Date().toISOString()}</p></div></div>`;
      try { await transporter.sendMail({ from: env.EMAIL_FROM, to: testEmail, subject: "You're in — VEYL", html: visitorHtml }); out.visitor = 'sent'; } catch(e){ out.visitor = 'failed'; out.visitorError = String(e.message||e); }
      try { await transporter.sendMail({ from: env.EMAIL_FROM, to: env.WAITLIST_ADMIN_EMAIL, subject: 'New VEYL waitlist signup', html: adminHtml }); out.admin = 'sent'; } catch(e){ out.admin = 'failed'; out.adminError = String(e.message||e); }
    } else {
      out.emailSkipped = 'SMTP not configured';
    }
  } catch (e) {
    out.unexpected = String(e.message||e);
  }
  console.log(JSON.stringify(out, null, 2));
})();
