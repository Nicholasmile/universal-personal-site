# Portfolio Studio

Open `editor/index.html` in a current browser. On Windows, double-click `OPEN EDITOR.cmd`. Keep the extracted template folder together: the editor uses local CSS and JavaScript files.

No installation, Python, GitHub account, OAuth configuration or internet connection is needed to edit and export. An internet connection and hosting account are needed to put the website online. Images supplied by URL also need internet access; uploading a photo makes it portable.

## Edit your website

1. Replace the sample profile with your name, introduction and biography.
2. Choose a colour theme and the sections you want to show.
3. Upload a PNG, JPEG or WebP profile photo, up to 2 MB. You can remove it entirely.
4. Open Projects, Writing or Notes. Replace or remove the examples and add your entries.
5. Check **Include in website** when an entry is ready. New entries start as drafts.
6. Select a page above the preview, or follow its internal links. Use Mobile to check the narrow layout. External links are disabled inside the preview.

Articles support paragraphs, headings, bullet lists, bold text, inline code, fenced code blocks, blockquotes and HTTP(S) links. Raw HTML is displayed as text. Images inside article Markdown and advanced Markdown features are not supported in this release.

Article addresses must be unique lowercase words separated by hyphens, such as `my-first-article`. Dates and links are checked before export. A visible error explains anything that needs fixing. While a field is invalid, the preview keeps its last valid version.

## Keep an editable copy

The editor attempts to save changes in this browser. Storage can behave differently for files opened directly from disk, private browsing, or a moved template folder. **Save backup** downloads your complete editable website as JSON, including drafts and your uploaded photo. Keep it somewhere safe and download an updated copy after editing.

**Open backup** restores that file. Before replacing your work, the editor downloads your previous state as `portfolio-before-import.json`. Resetting sample content also downloads a recovery copy. Check that your browser allowed these downloads.

Do not upload the backup to public hosting: it includes drafts. The backup is how you move your editable work to another computer or browser. A website ZIP cannot be imported as a backup.

## Download and publish

**Download website** produces `my-portfolio-website.zip`. It contains complete HTML pages, styles, a small menu script, and your uploaded photo. Content is readable without JavaScript; JavaScript only controls the mobile menu. Drafts and hidden sections are excluded. The editor and editable JSON data are excluded too.

Extract the ZIP to preview the exported website by opening `index.html`. You do not need a local web server for this exported version.

For Cloudflare Pages, use Direct Upload and upload the website ZIP or its extracted folder. Follow the [official Direct Upload guide](https://developers.cloudflare.com/pages/get-started/direct-upload/). A Direct Upload project cannot later be switched to Git integration; that requires a new project.

For another static hosting provider, upload the extracted website files so `index.html` is at the published root. Custom domains are configured with your hosting provider.

For updates, edit, save a new backup, export a new website ZIP, then create a new deployment using the complete new export. The editor does not deploy automatically. Replace the previous deployment rather than merging new files into it; otherwise removed articles may remain accessible.

## Limits

- Up to 200 entries in each section.
- Backup imports must be smaller than 8 MB.
- The editor supports one profile photo; project galleries are not included.
- Remote image URLs depend on the external image remaining available.
- Exported articles use `article-your-address.html`. Legacy `article.html?slug=...` links are not preserved.
- Social preview metadata includes titles and descriptions. Domain-specific canonical URLs and social preview images are not yet configurable.

The original `/admin/` CMS is separate from this editor. Changes made in one do not automatically sync to the other.
