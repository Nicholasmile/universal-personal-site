(function (root) {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function safeURL(value) {
    try { const u = new URL(String(value)); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; }
  }
  function safeImage(value) {
    return /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value || '') || safeURL(value) ? value : '';
  }
  // Raw HTML is escaped. This deliberately small Markdown renderer never accepts HTML.
  function inline(value) {
    return esc(value).replace(/\[([^\]\n]+)\]\(([^\s)]+)\)/g, (_, label, url) => {
      const href = safeURL(url.replace(/&amp;/g, '&'));
      return href ? `<a href="${esc(href)}" rel="noopener noreferrer">${label}</a>` : label;
    }).replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`\n]+)`/g, '<code>$1</code>');
  }
  function markdown(value) {
    let out = '', list = false, code = false, lines = [];
    const closeList = () => { if (list) { out += '</ul>'; list = false; } };
    for (const line of String(value || '').split('\n')) {
      if (/^```/.test(line)) {
        closeList();
        if (code) { out += `<pre><code>${esc(lines.join('\n'))}</code></pre>`; lines = []; }
        code = !code; continue;
      }
      if (code) { lines.push(line); continue; }
      if (/^[-*] /.test(line)) { if (!list) { out += '<ul>'; list = true; } out += `<li>${inline(line.slice(2))}</li>`; continue; }
      closeList();
      const heading = /^(#{1,6}) (.*)$/.exec(line);
      if (heading) { const n = Math.max(2, heading[1].length); out += `<h${n}>${inline(heading[2])}</h${n}>`; }
      else if (/^> /.test(line)) out += `<blockquote>${inline(line.slice(2))}</blockquote>`;
      else if (line.trim()) out += `<p>${inline(line)}</p>`;
    }
    closeList();
    if (code) out += `<pre><code>${esc(lines.join('\n'))}</code></pre>`;
    return out;
  }
  function validate(input, publishing = false) {
    if (!input || input.version !== 1 || !input.site || !['posts','projects','notes'].every(k => Array.isArray(input[k]))) throw Error('Choose a website backup exported by this editor.');
    const site = input.site;
    for (const k of ['name','tagline','intro','bio','location','email','profileImage','theme']) if (typeof site[k] !== 'string') throw Error(`Your profile needs a valid ${k} field.`);
    if (publishing && !site.name.trim()) throw Error('Enter your name before exporting.');
    if (!['forest','navy','wine','sand','charcoal'].includes(site.theme)) throw Error('Choose one of the five available themes.');
    for (const k of ['showWriting','showPortfolio','showNotes']) if (typeof site[k] !== 'boolean') throw Error('Section visibility settings are invalid.');
    if (!site.socials || typeof site.socials !== 'object') throw Error('Social links are missing.');
    for (const k of ['linkedin','github','x','instagram']) {
      if (typeof site.socials[k] !== 'string' || (publishing && site.socials[k] && !safeURL(site.socials[k]))) throw Error(`Use a complete https:// or http:// URL for ${k}.`);
    }
    if (publishing && site.email && !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(site.email)) throw Error('Enter a valid email address, or leave it empty.');
    if (publishing && site.profileImage && !safeImage(site.profileImage)) throw Error('Upload a PNG, JPEG or WebP profile image, or use an https:// image URL.');
    const seen = new Set();
    const fields = {posts:['title','slug','date','category','excerpt','body'], projects:['title','category','description','url'], notes:['date','text']};
    for (const kind of Object.keys(fields)) {
      if (input[kind].length > 200) throw Error('Keep each section to 200 entries or fewer.');
      for (const item of input[kind]) {
        if (!item || !fields[kind].every(k => typeof item[k] === 'string') || typeof item.published !== 'boolean') throw Error(`One of your ${kind} entries is incomplete.`);
        if (kind !== 'notes' && typeof item.featured !== 'boolean') throw Error('Featured settings are invalid.');
        const active = publishing && item.published && site[{posts:'showWriting',projects:'showPortfolio',notes:'showNotes'}[kind]];
        if (active && kind !== 'notes' && !item.title.trim()) throw Error('Every published article and project needs a title.');
        if (active && kind === 'notes' && !item.text.trim()) throw Error('Every published note needs some text.');
        if (active && kind === 'posts') {
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || item.slug.length > 100) throw Error('Article addresses must use lowercase letters, numbers and single hyphens (up to 100 characters).');
          if (seen.has(item.slug)) throw Error(`Two articles use the address “${item.slug}”. Choose a different address.`);
          seen.add(item.slug);
        }
        if (active && 'date' in item) {
          const d = new Date(`${item.date}T00:00:00Z`);
          if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date) || !Number.isFinite(d.getTime()) || d.toISOString().slice(0,10) !== item.date) throw Error('Each article and note needs a valid date.');
        }
        if (active && kind === 'projects' && item.url && !safeURL(item.url)) throw Error('Project links must start with https:// or http://.');
      }
    }
    // Copy only known fields; imported metadata and unknown keys never reach the website.
    const clean = { version:1, site:{}, posts:[], projects:[], notes:[] };
    for (const k of ['name','tagline','intro','bio','location','email','profileImage','theme','showWriting','showPortfolio','showNotes']) clean.site[k] = site[k];
    clean.site.socials = Object.fromEntries(['linkedin','github','x','instagram'].map(k => [k,site.socials[k]]));
    for (const kind of Object.keys(fields)) clean[kind] = input[kind].map(item => Object.fromEntries([...fields[kind], 'published', ...(kind === 'notes' ? [] : ['featured'])].map(k => [k,item[k]])));
    return clean;
  }
  function build(input, css, options = {}) {
    const data = validate(input, true), s = data.site;
    const files = {}, posts = s.showWriting ? data.posts.filter(p => p.published).sort((a,b) => b.date.localeCompare(a.date)) : [];
    const projects = s.showPortfolio ? data.projects.filter(p => p.published) : [];
    const notes = s.showNotes ? data.notes.filter(n => n.published).sort((a,b) => b.date.localeCompare(a.date)) : [];
    let image = s.profileImage;
    if (image.startsWith('data:') && !options.preview) {
      const match = /^data:image\/(png|jpeg|webp);base64,(.+)$/.exec(image);
      image = `assets/images/profile.${match[1] === 'jpeg' ? 'jpg' : match[1]}`;
      const raw = atob(match[2]); files[image] = Uint8Array.from(raw, c => c.charCodeAt(0));
    }
    const photo = image ? `<div class="hero-photo"><img src="${esc(image)}" alt="${esc(s.name)}" width="600" height="600"></div>` : '';
    const nav = [['Home','index.html'],['About','about.html'],...(s.showWriting ? [['Writing','writing.html']] : []),...(s.showPortfolio ? [['Portfolio','portfolio.html']] : []),...(s.showNotes ? [['Notes','notes.html']] : []),['Contact','contact.html']];
    const socials = Object.entries(s.socials).filter(([,url]) => url).map(([name,url]) => `<a href="${esc(safeURL(url))}" target="_blank" rel="noopener noreferrer">${esc({linkedin:'LinkedIn',github:'GitHub',x:'X',instagram:'Instagram'}[name])}</a>`).join('');
    const menuScript = "document.querySelector('.nav-toggle').addEventListener('click',function(){const open=this.getAttribute('aria-expanded')!=='true';this.setAttribute('aria-expanded',String(open));document.querySelector('.nav-links').classList.toggle('open',open)});";
    const shell = (title, description, body, current) => `<!doctype html><html lang="en" data-theme="${esc(s.theme)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — ${esc(s.name)}</title><meta name="description" content="${esc(description)}"><meta property="og:title" content="${esc(title)} — ${esc(s.name)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="${current.startsWith('article-') ? 'article' : 'website'}">${options.preview ? `<style>${css}</style>` : '<link rel="stylesheet" href="assets/css/style.css">'}</head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="container nav"><a class="brand" href="index.html">${esc(s.name)}</a><button class="nav-toggle" aria-expanded="false" aria-controls="navigation">Menu</button><nav id="navigation" class="nav-links" aria-label="Main navigation">${nav.map(([label,url]) => `<a href="${url}"${url === current ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav></div></header><main id="main">${body}</main><footer class="site-footer"><div class="container footer-row"><div>© ${new Date().getFullYear()} ${esc(s.name)}</div><div class="socials">${socials}</div></div></footer>${options.preview ? `<script>${menuScript}</script>` : '<script src="assets/js/navigation.js" defer></script>'}</body></html>`;
    const hero = (title, intro) => `<section class="page-hero"><div class="container"><h1>${esc(title)}</h1><p class="lede">${esc(intro)}</p></div></section>`;
    const postCard = p => `<article class="card"><div class="meta"><span class="tag">${esc(p.category)}</span><time datetime="${esc(p.date)}">${esc(p.date)}</time></div><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><a class="text-link" href="article-${esc(p.slug)}.html">Read article →</a></article>`;
    const projectCard = p => `<article class="card"><span class="tag">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${p.url ? `<a class="text-link" href="${esc(safeURL(p.url))}" target="_blank" rel="noopener noreferrer">View project →</a>` : ''}</article>`;
    const section = (title, items, render) => `<section class="section"><div class="container"><h2>${title}</h2><div class="grid">${items.length ? items.map(render).join('') : '<p class="empty">Nothing published yet.</p>'}</div></div></section>`;
    files['index.html'] = shell('Home', s.intro, `<section class="container hero"><div><div class="eyebrow">Personal website</div><h1>${esc(s.name)}</h1><p class="lede">${esc(s.tagline)}</p><p>${esc(s.intro)}</p><div class="actions">${s.showWriting ? '<a class="button" href="writing.html">Read my writing</a>' : s.showPortfolio ? '<a class="button" href="portfolio.html">View my work</a>' : ''}<a class="button secondary" href="about.html">About me</a></div></div>${photo}</section>${s.showWriting ? section('Recent writing', [...posts].sort((a,b) => Number(b.featured)-Number(a.featured) || b.date.localeCompare(a.date)).slice(0,3), postCard) : ''}${s.showPortfolio ? section('Selected work', [...projects].sort((a,b) => Number(b.featured)-Number(a.featured)).slice(0,3), projectCard) : ''}`, 'index.html');
    files['about.html'] = shell('About', s.tagline, hero('About', s.tagline) + `<section class="container hero"><div><h2>${esc(s.name)}</h2><div class="biography">${esc(s.bio)}</div><p>${esc(s.location)}</p></div>${photo}</section>`, 'about.html');
    files['contact.html'] = shell('Contact', `Get in touch with ${s.name}`, hero('Contact', 'Let’s connect.') + `<section class="prose"><h2>${esc(s.name)}</h2>${s.email ? `<p><a class="text-link" href="mailto:${esc(s.email)}">${esc(s.email)}</a></p>` : ''}<div class="socials">${socials}</div></section>`, 'contact.html');
    if (s.showWriting) files['writing.html'] = shell('Writing', `Articles by ${s.name}`, hero('Writing','Ideas, essays and reflections.') + section('Articles',posts,postCard), 'writing.html');
    if (s.showPortfolio) files['portfolio.html'] = shell('Portfolio', `Selected work by ${s.name}`, hero('Portfolio','Projects and work worth sharing.') + section('Projects',projects,projectCard), 'portfolio.html');
    if (s.showNotes) files['notes.html'] = shell('Notes', `Short notes by ${s.name}`, hero('Notes','Small ideas and observations.') + `<section class="section"><div class="container note-list">${notes.length ? notes.map(n => `<article class="note"><time datetime="${esc(n.date)}">${esc(n.date)}</time><p class="biography">${esc(n.text)}</p></article>`).join('') : '<p class="empty">No notes published yet.</p>'}</div></section>`, 'notes.html');
    for (const p of posts) files[`article-${p.slug}.html`] = shell(p.title,p.excerpt,hero(p.title,`${p.category} · ${p.date}`) + `<article class="prose">${markdown(p.body)}</article>`, `article-${p.slug}.html`);
    files['404.html'] = shell('Page not found','This page could not be found.',hero('Page not found','This address may have changed.') + '<div class="prose"><a class="button" href="index.html">Go home</a></div>', '404.html');
    files['assets/css/style.css'] = css;
    files['assets/js/navigation.js'] = menuScript;
    files['robots.txt'] = 'User-agent: *\nAllow: /\n';
    files['_headers'] = '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n';
    return files;
  }
  // ZIP "store" format, UTF-8 filenames, CRC32. No network dependency or compression library.
  function zip(files) {
    const encoder = new TextEncoder(), chunks = [], central = []; let offset = 0;
    const crc = bytes => { let c = 0xffffffff; for (const b of bytes) { c ^= b; for (let n=0;n<8;n++) c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0); } return (c ^ 0xffffffff) >>> 0; };
    const header = size => { const bytes = new Uint8Array(size); return {bytes, view:new DataView(bytes.buffer)}; };
    for (const [path,value] of Object.entries(files)) {
      const name = encoder.encode(path), bytes = typeof value === 'string' ? encoder.encode(value) : value, checksum = crc(bytes);
      const local = header(30); local.view.setUint32(0,0x04034b50,true); local.view.setUint16(4,20,true); local.view.setUint16(6,0x800,true); local.view.setUint16(12,33,true); local.view.setUint32(14,checksum,true); local.view.setUint32(18,bytes.length,true); local.view.setUint32(22,bytes.length,true); local.view.setUint16(26,name.length,true);
      chunks.push(local.bytes,name,bytes);
      const record = header(46); record.view.setUint32(0,0x02014b50,true); record.view.setUint16(4,20,true); record.view.setUint16(6,20,true); record.view.setUint16(8,0x800,true); record.view.setUint16(14,33,true); record.view.setUint32(16,checksum,true); record.view.setUint32(20,bytes.length,true); record.view.setUint32(24,bytes.length,true); record.view.setUint16(28,name.length,true); record.view.setUint32(42,offset,true);
      central.push(record.bytes,name); offset += 30 + name.length + bytes.length;
    }
    const size = central.reduce((n,b) => n+b.length,0), end = header(22);
    end.view.setUint32(0,0x06054b50,true); end.view.setUint16(8,central.length/2,true); end.view.setUint16(10,central.length/2,true); end.view.setUint32(12,size,true); end.view.setUint32(16,offset,true);
    const result = new Uint8Array(offset+size+22); let pos = 0;
    for (const bytes of [...chunks,...central,end.bytes]) { result.set(bytes,pos); pos += bytes.length; }
    return result;
  }
  const api = {esc,safeURL,safeImage,markdown,validate,build,zip};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SiteBuilder = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
