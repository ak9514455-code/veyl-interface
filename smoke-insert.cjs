const { readFileSync } = require('fs');
const { createClient } = require('@supabase/supabase-js');
const envText = readFileSync('.env.local', 'utf8');
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
const email = process.argv[2];
async function main(){
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data, error } = await supabase.from('waitlist_signups').insert({ email }).select().single();
  console.log(JSON.stringify({ email, inserted: !error, created_at: data?.created_at, error: error ? { code: error.code, message: error.message } : null }, null, 2));
}
main().catch((error) => { console.error(JSON.stringify({ error: String(error) }, null, 2)); process.exit(1); });
