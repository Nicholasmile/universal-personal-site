// Create the giveaway ZIP with generic samples, never browser-local owner data.
const fs = require('node:fs'), path = require('node:path');
const B = require('../assets/js/site-builder.js'), root = path.resolve(__dirname,'..'), files = {};
const excluded = new Set(['.git','.codex','.agents','.openai','hosted-studio','github-source','node_modules','dist']);
function walk(dir) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    if (excluded.has(entry.name) || /\.(zip|log|tar|gz)$/.test(entry.name) || ['editor-preview.png','cloudflare-public-preview.png','PUBLIC_SITE.md'].includes(entry.name)) continue;
    const absolute = path.join(dir,entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.isFile()) files[path.relative(root,absolute).split(path.sep).join('/')] = new Uint8Array(fs.readFileSync(absolute));
  }
}
walk(root);
fs.writeFileSync(path.join(root,'portfolio-template.zip'),B.zip(files));
console.log(`Packaged ${Object.keys(files).length} template files in portfolio-template.zip.`);
