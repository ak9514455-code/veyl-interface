import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const envPath = path.resolve('.env.local');
if (!fs.existsSync(envPath)) throw new Error('.env.local not found');
const text = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const raw of text.split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx === -1) continue;
  let key = line.slice(0, idx).trim();
  let val = line.slice(idx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  env[key] = val;
}

const host = env.MAIL_HOST;
const port = Number(env.MAIL_PORT || 587);
const user = env.MAIL_USER;
const pass = env.MAIL_PASS;
const from = env.EMAIL_FROM || user;
if (!host || !user || !pass) throw new Error('Missing MAIL_HOST/MAIL_USER/MAIL_PASS in .env.local');

const to = process.argv[2] || user;
console.log('Sending test email to', to);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
  logger: true,
  debug: true,
});

const info = await transporter.sendMail({ from, to, subject: 'VEYL test email', text: 'This is a test from VEYL SMTP setup.', html: '<p>This is a test from VEYL SMTP setup.</p>' });
console.log('Send result:', info);
