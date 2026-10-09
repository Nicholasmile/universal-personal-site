# Developer Guide

## Architecture

Portfolio Studio is a buildless browser application. `editor/index.html` loads local CSS, `assets/js/site-builder.js`, `editor/seed.js` and `editor/editor.js`. It also works from a file URL because the editor does not fetch JSON or other assets at runtime.

`seed.js` bundles sample content and the shared website CSS. Regenerate it with `node tools/prepare-editor.cjs` after changing source JSON or `assets/css/style.css`. Keep bundled content generic: users receive these samples as part of the editor.

`editor.js` owns the editing state, form controls, debounced preview, localStorage autosave, backup downloads and imports, image file handling and export downloads. Browser-local saving is best effort; downloaded JSON backups are the user's portable source of truth. Imports and resets download a recovery copy before replacing state.

`site-builder.js` exposes a browser global and a CommonJS export for Node checks. It validates and normalizes a version 1 content document, renders complete static pages and creates ZIP archives using store mode and CRC32. No npm installation is required.

## Content contract

An editable backup contains `version: 1`, `site`, and `posts`, `projects`, `notes` arrays. The profile fields match the original `content/site.json` model. Uploaded profile photos are PNG/JPEG/WebP data URLs in backups and become binary assets in website exports. Remote HTTP(S) images remain remote.

Structural validation allows unfinished draft fields to survive backup round trips. Publishing validates the profile and every published entry in a visible section, including dates, unique article slugs and safe links. Unknown imported fields are discarded.

The editor displays supported Markdown without accepting raw HTML. It supports headings, paragraphs, bullet lists, bold, inline/fenced code, blockquotes and links. Keep the documented formatting contract in sync with the renderer. Do not replace this with unsanitized Markdown output.

## Static output

`build()` generates root-level HTML pages, `article-SLUG.html`, CSS, a menu script, binary photo data when present, robots.txt and Cloudflare-compatible `_headers`. Only visible sections and published entries are rendered. No source JSON, drafts, backup, editor or CMS credentials are included in the portable export.

Preview uses the same renderer with inline CSS and embedded photo data in a sandboxed iframe. Its navigation bridge sends a page-name message to the editor. The editor verifies the sender is its preview frame and only accepts filenames from the rendered file map. Preview external links are disabled. Export links are normal links.

Canonical URLs, a generated sitemap, Open Graph images, galleries and advanced Markdown are outside the current export contract.

## Optional CMS build

The original root pages and `assets/js/app.js` remain a legacy JSON-driven developer preview. They require a web server. Do not deploy those source files directly when drafts are present.

`node tools/build-site.cjs` reads repository JSON and renders `dist/` with the same builder. It also writes `sample-website.zip`. Each build replaces only the checked, dedicated `dist/` output directory so removed public pages cannot remain there. Never store manually maintained files in `dist/`.

`node tools/build-site.cjs --cms` additionally copies the Decap CMS loader and configuration into `dist/admin/`. The included Netlify configuration runs this command and publishes `dist/`. The CMS still edits source repository JSON. CMS and editor state do not automatically synchronize.

A private source repository is needed if drafts should not be public in GitHub files/history. Draft exclusion from the website cannot make a public repository private.

## Verification

```text
node --test tests/builder.test.cjs
node --check editor/editor.js
node tools/build-site.cjs
node tools/serve.cjs
```

The last command serves a developer preview at `http://127.0.0.1:8000/editor/`. The editor itself does not require this server. For browser QA, exercise profile changes, section hiding, theme/mobile selection, draft creation, backup/import, validation errors and website download. Also inspect exported pages directly, with JavaScript disabled where practical.

Tests cover public draft exclusion, hidden sections, HTML/link safety, invalid dates/slugs, unfinished draft backups, photo extraction and ZIP CRC/header offsets.
