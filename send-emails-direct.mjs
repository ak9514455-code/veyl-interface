import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// load env
const envPath = path.resolve('.env.local');
if (!fs.existsSync(envPath)) throw new Error('.env.local not found');
const text = fs.readFileSync(envPath, 'utf8');
for (const raw of text.split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx === -1) continue;
  let key = line.slice(0, idx).trim();
  let val = line.slice(idx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  process.env[key] = val;
}

const email = process.argv[2] || process.env.MAIL_USER;
if (!email) throw new Error('No recipient email provided');
console.log('Sending visitor + admin emails to', email);

const moduleUrl = pathToFileURL(path.resolve('src/lib/email.ts')).href;
const { sendWaitlistConfirmation, sendAdminWaitlistNotification } = await import(moduleUrl);
try {
  await sendWaitlistConfirmation(email);
  console.log('Visitor email sent (or written)');
  await sendAdminWaitlistNotification(email, new Date().toISOString());
  console.log('Admin email sent (or written)');
} catch (e) {
  console.error('Email send error', e);
}
