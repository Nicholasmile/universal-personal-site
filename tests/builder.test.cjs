const {test} = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm');
const B = require('../assets/js/site-builder.js');
const context = {window:{}}; vm.runInNewContext(fs.readFileSync(require.resolve('../editor/seed.js'),'utf8'),context);
const seed = JSON.parse(JSON.stringify(context.window.PORTFOLIO_SEED));
const sample = () => JSON.parse(JSON.stringify(seed.data));
test('export contains fully rendered content and excludes editor, JSON and drafts',() => {
  const data = sample(); data.posts.push({...data.posts[0],slug:'secret',published:false,title:'PRIVATE_DRAFT_MARKER',body:'DO_NOT_PUBLISH'});
  data.projects.push({...data.projects[0],published:false,description:'PRIVATE_PROJECT'});
  data.notes.push({...data.notes[0],published:false,text:'PRIVATE_NOTE'});
  const files = B.build(data,seed.css), output = Object.values(files).join('');
  assert.match(files['index.html'],/Your Name/); assert.match(files['article-welcome.html'],/Why this space exists/);
  for (const text of ['PRIVATE_DRAFT_MARKER','DO_NOT_PUBLISH','PRIVATE_PROJECT','PRIVATE_NOTE','fetch(','admin/']) assert.ok(!output.includes(text),text);
  assert.ok(!Object.keys(files).some(k => k.startsWith('editor/') || k.endsWith('.json')));
});
test('hidden sections have no pages, content, navigation or homepage actions',() => {
  const data = sample(); data.site.showWriting = data.site.showPortfolio = data.site.showNotes = false;
  const files = B.build(data,seed.css), html = Object.values(files).join('');
  assert.ok(!files['writing.html'] && !files['portfolio.html'] && !files['notes.html']);
  assert.ok(!Object.keys(files).some(k => k.startsWith('article-')));
  assert.ok(!html.includes('Read my writing') && !html.includes('View my work'));
});
test('raw HTML and unsafe links cannot execute',() => {
  const data = sample(); data.site.name = '<img src=x onerror=alert(1)>';
  data.posts[0].body = '<script>alert(1)</script>\n[bad](javascript:alert)\n**bold**\n[ok](https://example.com)';
  const html = B.build(data,seed.css)['article-welcome.html'];
  assert.ok(!html.includes('<script>alert') && !html.includes('<img src=x'));
  assert.ok(!html.includes('href="javascript:')); assert.match(html,/<strong>bold<\/strong>/);
  data.projects[0].url = 'javascript:alert(1)'; assert.throws(() => B.build(data,seed.css),/Project links/);
});
test('duplicate addresses, invalid dates and malformed backups fail clearly',() => {
  const data = sample(); data.posts[1].slug = data.posts[0].slug; assert.throws(() => B.build(data,seed.css),/Two articles/);
  data.posts[1].slug = '../escape'; assert.throws(() => B.build(data,seed.css),/Article addresses/);
  data.posts[1].slug = 'valid'; data.posts[1].date = '2026-02-30'; assert.throws(() => B.build(data,seed.css),/valid date/);
  assert.throws(() => B.validate({}),/backup/);
});
test('unfinished drafts survive backups and do not prevent website export',() => {
  const data = sample(); data.posts.push({title:'',slug:'',date:'',category:'',excerpt:'',body:'',featured:false,published:false});
  assert.equal(B.validate(data).posts.length,3); assert.ok(B.build(data,seed.css)['index.html']);
});
test('uploaded images become binary assets in website and remain embedded in backup',() => {
  const data = sample(); data.site.profileImage = 'data:image/png;base64,aGVsbG8=';
  const files = B.build(data,seed.css); assert.equal(new TextDecoder().decode(files['assets/images/profile.png']),'hello');
  assert.match(files['index.html'],/src="assets\/images\/profile.png"/);
  assert.match(B.build(data,seed.css,{preview:true})['index.html'],/data:image\/png/);
});
test('ZIP has valid CRC32, offsets, UTF-8 data and archive footer',() => {
  const files = B.build(sample(),seed.css); const bytes = B.zip(files), view = new DataView(bytes.buffer), decoder = new TextDecoder();
  let offset=0, count=0;
  const crc = payload => { let c=0xffffffff; for(const b of payload){c ^= b;for(let i=0;i<8;i++) c=(c>>>1)^((c&1)?0xedb88320:0);} return (c^0xffffffff)>>>0; };
  while(view.getUint32(offset,true) === 0x04034b50){
    const size = view.getUint32(offset+18,true), length = view.getUint16(offset+26,true);
    const name = decoder.decode(bytes.slice(offset+30,offset+30+length));
    const payload = bytes.slice(offset+30+length,offset+30+length+size);
    assert.equal(view.getUint32(offset+14,true),crc(payload)); assert.equal(decoder.decode(payload),files[name]);
    offset += 30+length+size; count++;
  }
  const end = bytes.length-22; assert.equal(view.getUint32(end,true),0x06054b50); assert.equal(view.getUint32(end+16,true),offset); assert.equal(view.getUint16(end+10,true),count);
  for(let i=0;i<count;i++){assert.equal(view.getUint32(offset,true),0x02014b50); const local = view.getUint32(offset+42,true); assert.equal(view.getUint32(local,true),0x04034b50); offset+=46+view.getUint16(offset+28,true);}
  assert.equal(offset,end);
});
