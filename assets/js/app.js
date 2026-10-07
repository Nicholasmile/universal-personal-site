const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

async function loadJSON(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function escapeHTML(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function linkOrEmpty(label, url) {
  return url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener">${escapeHTML(label)}</a>` : '';
}

async function initShell() {
  const site = await loadJSON('content/site.json');
  document.documentElement.dataset.theme = site.theme || 'forest';
  document.title = `${site.name} — Personal Website`;

  const header = $('#site-header');
  if (header) {
    header.innerHTML = `<div class="site-header"><div class="container nav"><a class="brand" href="index.html">${escapeHTML(site.name)}</a><button class="nav-toggle" aria-label="Open menu">Menu</button><nav class="nav-links"><a href="index.html">Home</a><a href="about.html">About</a>${site.showWriting ? '<a href="writing.html">Writing</a>' : ''}${site.showPortfolio ? '<a href="portfolio.html">Portfolio</a>' : ''}${site.showNotes ? '<a href="notes.html">Notes</a>' : ''}<a href="contact.html">Contact</a></nav></div></div>`;
    $('.nav-toggle')?.addEventListener('click', () => $('.nav-links')?.classList.toggle('open'));
  }

  const footer = $('#site-footer');
  if (footer) {
    footer.innerHTML = `<footer class="site-footer"><div class="container footer-row"><div>© ${new Date().getFullYear()} ${escapeHTML(site.name)}</div><div class="socials">${linkOrEmpty('LinkedIn',site.socials?.linkedin)}${linkOrEmpty('GitHub',site.socials?.github)}${linkOrEmpty('X',site.socials?.x)}${linkOrEmpty('Instagram',site.socials?.instagram)}<a class="admin-link" href="admin/">Admin</a></div></div></footer>`;
  }
  return site;
}

function postCard(post) {
  return `<article class="card"><div class="meta"><span class="tag">${escapeHTML(post.category || 'Writing')}</span><span>${escapeHTML(post.date || '')}</span></div><h3>${escapeHTML(post.title)}</h3><p>${escapeHTML(post.excerpt || '')}</p><a class="text-link" href="article.html?slug=${encodeURIComponent(post.slug)}">Read article →</a></article>`;
}

function projectCard(project) {
  const action = project.url ? `<p><a class="text-link" href="${escapeHTML(project.url)}" target="_blank" rel="noopener">View project →</a></p>` : '';
  return `<article class="card"><span class="tag">${escapeHTML(project.category || 'Project')}</span><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description || '')}</p>${action}</article>`;
}

async function renderHome(site) {
  $('#hero-name').textContent = site.name;
  $('#hero-tagline').textContent = site.tagline;
  $('#hero-intro').textContent = site.intro;
  $('#hero-photo').src = site.profileImage || 'assets/images/profile-placeholder.svg';

  const [{posts=[]},{projects=[]}] = await Promise.all([loadJSON('content/posts.json'), loadJSON('content/projects.json')]);
  const latest = posts.filter(p=>p.published).sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,3);
  const featuredProjects = projects.filter(p=>p.published).slice(0,3);
  $('#latest-posts').innerHTML = latest.length ? latest.map(postCard).join('') : '<p class="empty">No articles yet.</p>';
  $('#featured-projects').innerHTML = featuredProjects.length ? featuredProjects.map(projectCard).join('') : '<p class="empty">No projects yet.</p>';
  if (!site.showWriting) $('#writing-section')?.remove();
  if (!site.showPortfolio) $('#portfolio-section')?.remove();
}

async function renderWriting() {
  const {posts=[]} = await loadJSON('content/posts.json');
  const published = posts.filter(p=>p.published).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  $('#writing-grid').innerHTML = published.length ? published.map(postCard).join('') : '<p class="empty">No published articles yet.</p>';
}

async function renderPortfolio() {
  const {projects=[]} = await loadJSON('content/projects.json');
  const published = projects.filter(p=>p.published);
  $('#portfolio-grid').innerHTML = published.length ? published.map(projectCard).join('') : '<p class="empty">No published projects yet.</p>';
}

async function renderNotes() {
  const {notes=[]} = await loadJSON('content/notes.json');
  const published = notes.filter(n=>n.published).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  $('#notes-list').innerHTML = published.length ? published.map(n=>`<article class="note"><time>${escapeHTML(n.date)}</time><p>${escapeHTML(n.text)}</p></article>`).join('') : '<p class="empty">No notes yet.</p>';
}

async function renderAbout(site) {
  $('#about-name').textContent = site.name;
  $('#about-bio').textContent = site.bio;
  $('#about-location').textContent = site.location || '';
  $('#about-photo').src = site.profileImage || 'assets/images/profile-placeholder.svg';
}

async function renderContact(site) {
  $('#contact-name').textContent = site.name;
  $('#contact-email').textContent = site.email;
  $('#contact-email').href = `mailto:${site.email}`;
  $('#contact-socials').innerHTML = [
    linkOrEmpty('LinkedIn', site.socials?.linkedin),
    linkOrEmpty('GitHub', site.socials?.github),
    linkOrEmpty('X', site.socials?.x),
    linkOrEmpty('Instagram', site.socials?.instagram)
  ].filter(Boolean).join(' · ');
}

async function renderArticle() {
  const slug = new URLSearchParams(location.search).get('slug');
  const {posts=[]} = await loadJSON('content/posts.json');
  const post = posts.find(p=>p.slug===slug && p.published);
  if (!post) {
    $('#article').innerHTML = '<h1>Article not found</h1><p>The article may have been removed or is still a draft.</p>';
    return;
  }
  document.title = post.title;
  $('#article-title').textContent = post.title;
  $('#article-meta').textContent = `${post.category || 'Writing'} · ${post.date || ''}`;
  $('#article-body').innerHTML = window.marked ? marked.parse(post.body || '') : `<p>${escapeHTML(post.body || '')}</p>`;
}

(async () => {
  try {
    const site = await initShell();
    const page = document.body.dataset.page;
    if (page==='home') await renderHome(site);
    if (page==='writing') await renderWriting();
    if (page==='portfolio') await renderPortfolio();
    if (page==='notes') await renderNotes();
    if (page==='about') await renderAbout(site);
    if (page==='contact') await renderContact(site);
    if (page==='article') await renderArticle();
  } catch (error) {
    console.error(error);
    const main = $('main');
    if (main) main.innerHTML = '<div class="container page-hero"><h1>Content could not load</h1><p>Open this site through a web server or deploy it online. Browsers block local JSON loading from file:// URLs.</p></div>';
  }
})();
