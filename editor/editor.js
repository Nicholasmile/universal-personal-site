/* Browser-only editing. No account, network calls or publishing credentials. */
(() => {
  'use strict';
  const B = window.SiteBuilder, seed = window.PORTFOLIO_SEED, key = 'portfolio-studio-v1';
  const $ = s => document.querySelector(s), clone = v => JSON.parse(JSON.stringify(v));
  let data = clone(seed.data), tab = 'site', timer, previewFiles = {}, storageOK = true;
  function status(message, error = false) { $('#status').textContent = message; $('#status').classList.toggle('error', error); }
  try { const saved = localStorage.getItem(key); if (saved) { data = B.validate(JSON.parse(saved)); status('Restored your saved work. Save a backup before closing.'); } }
  catch { storageOK = false; status('Browser saving is unavailable or the saved copy is invalid. Use Save backup to keep your work.', true); }
  const fields = {
    site:[['name','Your name'],['tagline','What do you do?'],['intro','Homepage introduction','textarea'],['bio','About you','textarea'],['location','Location'],['email','Email address','email']],
    projects:[['title','Project title'],['category','Category'],['description','Description','textarea'],['url','Project link','url']],
    posts:[['title','Article title'],['slug','Article address'],['date','Date','date'],['category','Category'],['excerpt','Short description','textarea'],['body','Article','textarea']],
    notes:[['date','Date','date'],['text','Your note','textarea']]
  };
  function field(name,label,type,value,index) {
    const attr = `data-field="${name}"${index === undefined ? '' : ` data-index="${index}"`}`;
    const hint = name === 'slug' ? 'Use lowercase words separated by hyphens, e.g. my-first-article.' : name === 'body' ? 'Supports paragraphs, # headings, - lists, **bold**, `code`, fenced code blocks and [links](https://example.com). HTML appears as text.' : type === 'url' ? 'Use a complete address starting with https://.' : '';
    return `<label class="field">${label}${type === 'textarea' ? `<textarea ${attr}${name === 'body' ? ' class="article"' : ''}>${B.esc(value)}</textarea>` : `<input ${attr} type="${type || 'text'}" value="${B.esc(value)}">`}${hint ? `<small>${hint}</small>` : ''}</label>`;
  }
  function check(name,label,value,index) { return `<label class="check"><input type="checkbox" data-field="${name}"${index === undefined ? '' : ` data-index="${index}"`}${value ? ' checked' : ''}>${label}</label>`; }
  function render() {
    document.querySelectorAll('[data-tab]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.tab === tab)));
    if (tab === 'site') {
      $('#fields').innerHTML = fields.site.map(([k,l,t]) => field(k,l,t,data.site[k])).join('') +
        '<h2>Profile photo</h2><label class="field">Upload photo<input id="photo" type="file" accept="image/png,image/jpeg,image/webp"><small>PNG, JPEG or WebP, up to 2 MB. A square photo works best.</small></label>' + field('profileImage','Or use an image URL','text',data.site.profileImage.startsWith('data:') ? '' : data.site.profileImage) + '<button type="button" id="clear-photo">Remove photo</button>' +
        `<label class="field">Colour theme<select data-field="theme">${['forest','navy','wine','sand','charcoal'].map(t => `<option value="${t}"${data.site.theme === t ? ' selected' : ''}>${t[0].toUpperCase()+t.slice(1)}</option>`).join('')}</select></label><h2>Your sections</h2>` +
        ['Writing','Portfolio','Notes'].map(n => check(`show${n}`,`Show ${n}`,data.site[`show${n}`])).join('') + '<small>Hidden sections are left out of your website download.</small><h2>Social links</h2>' +
        ['linkedin','github','x','instagram'].map(k => field(`socials.${k}`,{linkedin:'LinkedIn',github:'GitHub',x:'X',instagram:'Instagram'}[k],'url',data.site.socials[k])).join('');
    } else {
      $('#fields').innerHTML = '<p><small>Replace the examples with your own work. Uncheck “Include in website” to keep an entry as a private draft in your backup.</small></p>' + data[tab].map((item,i) => `<section class="entry"><div class="entry-head"><h2>${{projects:'Project',posts:'Article',notes:'Note'}[tab]} ${i+1}</h2><button type="button" class="remove" data-remove="${i}">Remove</button></div>${fields[tab].map(([k,l,t]) => field(k,l,t,item[k],i)).join('')}${tab !== 'notes' ? check('featured','Feature on homepage',item.featured,i) : ''}${check('published','Include in website',item.published,i)}</section>`).join('') + `<button type="button" class="add" id="add">+ Add ${{projects:'project',posts:'article',notes:'note'}[tab]}</button>`;
    }
  }
  function save() {
    try { localStorage.setItem(key,JSON.stringify(data)); storageOK = true; status('Saved in this browser. Download a backup to keep a separate copy.'); }
    catch { storageOK = false; status('Browser storage is full or unavailable. Download a backup to keep your changes.',true); }
  }
  function preview() {
    try {
      previewFiles = B.build(data,seed.css,{preview:true});
      const selected = $('#preview-page').value;
      $('#preview-page').innerHTML = Object.keys(previewFiles).filter(k => k.endsWith('.html') && k !== '404.html').map(k => `<option value="${k}">${B.esc(k.startsWith('article-') ? data.posts.find(p => `article-${p.slug}.html` === k)?.title : {'index.html':'Home','about.html':'About','contact.html':'Contact','writing.html':'Writing','portfolio.html':'Portfolio','notes.html':'Notes'}[k])}</option>`).join('');
      $('#preview-page').value = previewFiles[selected] ? selected : 'index.html';
      showPreview(); $('#preview-error').hidden = true;
    } catch (error) { $('#preview-error').textContent = `${error.message} Preview will update when this is fixed.`; $('#preview-error').hidden = false; }
  }
  function showPreview() {
    // Sandboxed preview intercepts internal links; it cannot access the parent editor.
    const bridge = `<script>document.addEventListener('click',function(e){const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href');if(href.endsWith('.html')&&!href.includes(':')){e.preventDefault();parent.postMessage({type:'portfolio-preview',page:href},'*')}else if(href.startsWith('#'))return;else e.preventDefault()});<\/script>`;
    $('#preview').srcdoc = previewFiles[$('#preview-page').value].replace('</body>',bridge+'</body>');
  }
  function changed() { save(); clearTimeout(timer); timer = setTimeout(preview,250); }
  $('#fields').addEventListener('submit',e => e.preventDefault());
  $('#fields').addEventListener('input',e => {
    const el = e.target, name = el.dataset.field; if (!name) return;
    const target = tab === 'site' ? data.site : data[tab][Number(el.dataset.index)];
    const value = el.type === 'checkbox' ? el.checked : el.value;
    if (name.startsWith('socials.')) target.socials[name.split('.')[1]] = value; else target[name] = value;
    changed();
  });
  $('#fields').addEventListener('change',async e => {
    if (e.target.id !== 'photo') return;
    const file = e.target.files[0]; if (!file) return;
    try {
      if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 2*1024*1024) throw Error('Choose a PNG, JPEG or WebP photo smaller than 2 MB.');
      const uri = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(Error('Could not read that photo.')); reader.readAsDataURL(file); });
      await new Promise((resolve,reject) => { const image = new Image(); image.onload = resolve; image.onerror = () => reject(Error('That file is not a readable image.')); image.src = uri; });
      data.site.profileImage = uri; changed(); render();
    } catch (error) { status(error.message,true); }
  });
  $('#fields').addEventListener('click',e => {
    const button = e.target.closest('button'); if (!button) return;
    if (button.id === 'clear-photo') data.site.profileImage = '';
    else if (button.dataset.remove !== undefined) data[tab].splice(Number(button.dataset.remove),1);
    else if (button.id === 'add') {
      if (data[tab].length >= 200) { status('Each section can contain up to 200 entries.',true); return; }
      const item = Object.fromEntries(fields[tab].map(([k]) => [k,'']));
      if ('date' in item) { const now = new Date(); item.date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; }
      if (tab !== 'notes') item.featured = false;
      if (tab === 'posts') { let n = 1; while (data.posts.some(p => p.slug === `article-${n}`)) n++; item.slug = `article-${n}`; }
      item.published = false; data[tab].push(item);
    } else return;
    changed(); render();
    if (button.id === 'add') $('#fields .entry:last-of-type input')?.focus();
  });
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click',() => { tab = button.dataset.tab; render(); }));
  $('#preview-page').addEventListener('change',showPreview);
  window.addEventListener('message',e => { if (e.source === $('#preview').contentWindow && e.data?.type === 'portfolio-preview' && previewFiles[e.data.page]) { $('#preview-page').value = e.data.page; showPreview(); } });
  $('#mobile').addEventListener('click',() => { const active = $('#preview').classList.toggle('mobile'); $('#mobile').setAttribute('aria-pressed',String(active)); $('#mobile').textContent = active ? 'Desktop' : 'Mobile'; });
  function download(value,type,name) { const url = URL.createObjectURL(new Blob([value],{type})), a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url),10000); }
  $('#backup').addEventListener('click',() => { download(JSON.stringify(data,null,2),'application/json','my-portfolio-backup.json'); status('Backup downloaded. Keep it safe: it includes your drafts and photo.'); });
  $('#import').addEventListener('change',async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      if (file.size > 8*1024*1024) throw Error('Choose a backup smaller than 8 MB.');
      const next = B.validate(JSON.parse(await file.text()));
      // Keep the current work as a download before replacing it.
      download(JSON.stringify(data,null,2),'application/json','portfolio-before-import.json');
      data = next; render(); changed(); status('Backup opened. Your previous work was downloaded as portfolio-before-import.json.');
    } catch (error) { status(`Could not open backup: ${error.message}`,true); }
    e.target.value = '';
  });
  $('#export').addEventListener('click',() => {
    try { const files = B.build(data,seed.css); download(B.zip(files),'application/zip','my-portfolio-website.zip'); status('Website downloaded. Upload the ZIP to your host to publish. Save a backup for future edits.'); }
    catch (error) { status(error.message,true); }
  });
  $('#reset').addEventListener('click',() => $('#reset-dialog').showModal());
  $('#cancel-reset').addEventListener('click',() => $('#reset-dialog').close());
  $('#confirm-reset').addEventListener('click',() => { download(JSON.stringify(data,null,2),'application/json','portfolio-before-reset.json'); data = clone(seed.data); $('#reset-dialog').close(); render(); changed(); });
  window.addEventListener('beforeunload',e => { if (!storageOK) { e.preventDefault(); e.returnValue = ''; } });
  render(); preview();
})();
