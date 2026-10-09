// Package only the public editor's static files for any static hosting provider.
const fs = require('node:fs'), path = require('node:path');
const B = require('../assets/js/site-builder.js');
const root = path.resolve(__dirname,'..'), publicRoot = path.join(root,'hosted-studio','dist'), files = {};
function walk(dir) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    if (entry.name.startsWith('.')) continue;
    const filename = path.join(dir,entry.name);
    if (entry.isDirectory()) walk(filename);
    else if (entry.isFile()) files[path.relative(publicRoot,filename).split(path.sep).join('/')] = new Uint8Array(fs.readFileSync(filename));
  }
}
walk(publicRoot);
if (!files['index.html'] || !files['portfolio-template.zip']) throw Error('Run the template and hosted editor preparation commands first.');
files['_headers'] = '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n';
fs.writeFileSync(path.join(root,'portfolio-studio-public.zip'),B.zip(files));
console.log(`Public editor packaged: portfolio-studio-public.zip (${Object.keys(files).length} files).`);
