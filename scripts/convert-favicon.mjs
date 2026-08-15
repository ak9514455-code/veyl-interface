import fs from 'fs';
import path from 'path';
import pngToIco from 'png-to-ico';

const src = path.resolve('public/favicon.png');
const out = path.resolve('public/favicon.ico');
if (!fs.existsSync(src)) {
  console.error('Source favicon.png not found at', src);
  process.exit(1);
}
const buffer = fs.readFileSync(src);
const ico = await pngToIco(buffer);
fs.writeFileSync(out, ico);
console.log('favicon.ico written to', out);
