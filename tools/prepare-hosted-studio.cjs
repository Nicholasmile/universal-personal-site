// Public editor only. Never read browser-local owner content or downloaded backups.
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname,'..'), out = path.join(root,'hosted-studio','dist');
fs.mkdirSync(path.join(out,'assets','js'),{recursive:true});
const read = name => fs.readFileSync(path.join(root,name),'utf8');
let index = read('editor/index.html').replace('../assets/js/site-builder.js','assets/js/site-builder.js');
index = index.replace('<title>Portfolio Studio</title>','<title>Portfolio Studio — Create your own website</title><meta name="description" content="Create a personal website without coding. Edit, preview and export a portable website for free.">');
index = index.replace('<div class="tools">','<div class="tools"><a class="file-button" href="portfolio-template.zip" download>Get offline template</a>');
index = index.replace('Ready to make this yours.','Your edits stay in this browser. Save a backup to keep a separate copy.');
fs.writeFileSync(path.join(out,'index.html'),index);
for (const filename of ['editor.css','editor.js','seed.js']) fs.copyFileSync(path.join(root,'editor',filename),path.join(out,filename));
fs.appendFileSync(path.join(out,'editor.css'),'\na.file-button{text-decoration:none;display:inline-flex;align-items:center}\n');
fs.copyFileSync(path.join(root,'assets/js/site-builder.js'),path.join(out,'assets/js/site-builder.js'));
fs.copyFileSync(path.join(root,'portfolio-template.zip'),path.join(out,'portfolio-template.zip'));
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\n');
console.log('Public Portfolio Studio prepared in hosted-studio/dist/.');
