import fs from 'fs';
import path from 'path';

function loadEnv(file) {
  const p = path.resolve(file);
  if (!fs.existsSync(p)) throw new Error('.env file not found: ' + p);
  const text = fs.readFileSync(p, 'utf8');
  const obj = {};
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const idx = t.indexOf('=');
    if (idx === -1) continue;
    let key = t.slice(0, idx).trim();
    let val = t.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    obj[key] = val;
  }
  return obj;
}

const env = loadEnv('./.env.local');
const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = env.RESEND_API_KEY;
const EMAIL_FROM = env.EMAIL_FROM;
const WAITLIST_ADMIN_EMAIL = env.WAITLIST_ADMIN_EMAIL;

async function sendEmail(apiKey, from, to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

async function run() {
  console.log('Starting waitlist integration tests...');
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.log('SKIP: Missing Supabase server env in .env.local');
    return;
  }
  if (!RESEND_API_KEY || !EMAIL_FROM || !WAITLIST_ADMIN_EMAIL) {
    console.log('SKIP: Missing Resend/email env in .env.local');
    return;
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const testEmail = `test+${Date.now()}@example.com`;
  console.log('\nTEST 1: New email -> insert + send emails');
  try {
    const { data, error } = await supabase.from('waitlist_signups').insert({ email: testEmail }).select().single();
    if (error) {
      console.log('Insert failed:', error.message || error.code || error);
    } else {
      console.log('Insert ok, created_at:', data.created_at);
      // send visitor email
      const visitorHtml = `<p>VEYL - YOU'RE IN.</p>`;
      const r1 = await sendEmail(RESEND_API_KEY, EMAIL_FROM, testEmail, "You're in — VEYL", visitorHtml);
      console.log('Visitor send:', r1.ok, r1.status);
      const adminHtml = `<p>VEYL / WAITLIST - ${testEmail}</p>`;
      const r2 = await sendEmail(RESEND_API_KEY, EMAIL_FROM, WAITLIST_ADMIN_EMAIL, 'New VEYL waitlist signup', adminHtml);
      console.log('Admin send:', r2.ok, r2.status);
    }
  } catch (e) {
    console.log('Unexpected error during insert/send:', e.message || e);
  }

  console.log('\nTEST 2: Duplicate email -> expect unique constraint');
  try {
    const { data: d2, error: e2 } = await supabase.from('waitlist_signups').insert({ email: testEmail }).select().single();
    if (e2) {
      console.log('Duplicate insert error observed as expected:', e2.message || e2.code || e2);
    } else {
      console.log('Warning: duplicate insert unexpectedly succeeded');
    }
  } catch (e) {
    console.log('Duplicate insert exception:', e.message || e);
  }

  console.log('\nTEST 3: Invalid email -> should be rejected by validation (script-side)');
  const invalid = 'not-an-email';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(invalid)) {
    console.log('Invalid email rejected locally as expected');
  } else {
    console.log('Invalid email regex unexpectedly passed');
  }

  console.log('\nTEST 4: Email provider failure simulation');
  try {
    const r = await sendEmail('invalid_api_key_for_test', EMAIL_FROM, testEmail, 'fail test', '<p>fail</p>');
    console.log('Provider failure simulated response:', r.ok, r.status);
  } catch (e) {
    console.log('Provider failure simulated exception:', e.message || e);
  }

  console.log('\nTEST 5: Supabase failure simulation');
  try {
    const badClient = createClient(SUPABASE_URL, 'invalid_key_for_test');
    const { data: bd, error: be } = await badClient.from('waitlist_signups').insert({ email: `fail+${Date.now()}@example.com` }).select().single();
    if (be) console.log('Supabase failure observed as expected:', be.message || be.code || be);
    else console.log('Supabase failure simulation unexpectedly succeeded');
  } catch (e) {
    console.log('Supabase failure exception:', e.message || e);
  }

  console.log('\nTests complete.\n');
}

run().catch((e) => {
  console.error('Test script error', e);
  process.exit(1);
});
