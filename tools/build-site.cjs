// Optional maintainer / CI build for the existing JSON + CMS workflow.
const fs = require('node:fs'), path = require('node:path');
const B = require('../assets/js/site-builder.js');
const root = path.resolve(__dirname,'..');
const json = file => JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const site = json('content/site.json');
if (site.profileImage && !B.safeImage(site.profileImage)) {
  const filename = path.resolve(root,site.profileImage);
  const imageRoot = path.join(root,'assets','images')+path.sep;
  if (!filename.startsWith(imageRoot)) throw Error('Local profile image must be inside assets/images.');
  const ext = path.extname(filename).toLowerCase(), type = {'.png':'png','.jpg':'jpeg','.jpeg':'jpeg','.webp':'webp'}[ext];
  // The starter SVG is a placeholder; omit it from portable exports.
  if (site.profileImage === 'assets/images/profile-placeholder.svg') site.profileImage = '';
  else {
    if (!type) throw Error('Use a PNG, JPEG or WebP profile image.');
    site.profileImage = `data:image/${type};base64,${fs.readFileSync(filename).toString('base64')}`;
  }
}
const data = {version:1,site,posts:json('content/posts.json').posts,projects:json('content/projects.json').projects,notes:json('content/notes.json').notes};
const files = B.build(data,fs.readFileSync(path.join(root,'assets/css/style.css'),'utf8'));
const out = path.join(root,'dist');
// Rebuild only the dedicated generated directory so old pages cannot retain drafts.
if (path.dirname(out) !== root || path.basename(out) !== 'dist') throw Error('Invalid output directory.');
fs.rmSync(out,{recursive:true,force:true});
for (const [name,content] of Object.entries(files)) { const target = path.join(out,name); fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,content); }
if (process.argv.includes('--cms')) fs.cpSync(path.join(root,'admin'),path.join(out,'admin'),{recursive:true});
fs.writeFileSync(path.join(root,'sample-website.zip'),B.zip(files));
console.log(`Built ${Object.keys(files).length} public files in dist/ and sample-website.zip.`);
