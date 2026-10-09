# Customization Guide

For the default portable workflow, customize Profile, themes, visibility and content in `editor/index.html`. See [Portfolio Studio](PORTABLE_EDITOR.md). The instructions below apply to the optional repository/CMS workflow. For maintainer edits to shared CSS or sample JSON, run `node tools/prepare-editor.cjs` afterward to refresh the offline editor bundle.

Most visual and content customization can be done without coding through `/admin/`.

This guide also shows where a developer can make deeper changes.

## No-code customization

Open the admin dashboard and use **Website Settings → Profile & Website**.

You can change:

- name
- tagline
- introduction
- biography
- location
- email
- profile image
- theme
- social links
- visible sections

## Themes

The template includes:

```text
Forest
Navy
Wine
Sand
Charcoal
```

The selected theme is stored in:

```text
content/site.json
```

as:

```json
"theme": "forest"
```

The browser sets a `data-theme` attribute on the root HTML element, and CSS variables control the design.

## Changing theme colours in code

Open:

```text
assets/css/style.css
```

Search for theme selectors such as:

```css
:root[data-theme="forest"]
```

Change the CSS variables inside the relevant theme block.

## Changing page wording

Some headings are part of the HTML templates rather than the CMS.

Examples:

- `index.html` — homepage section headings
- `about.html` — About page layout
- `writing.html` — Writing page intro
- `portfolio.html` — Portfolio page intro
- `notes.html` — Notes page intro
- `contact.html` — Contact page wording

A developer can edit those files with any text editor.

## Hiding sections

The admin dashboard has switches for:

- Writing
- Portfolio
- Notes

The JavaScript reads those settings and adjusts the navigation and homepage.

## Changing the profile image

The easiest method is through the CMS image field.

Uploaded media goes to:

```text
assets/images/uploads/
```

## Adding another social network

A developer should update two places:

1. `admin/config.yml` — add the new CMS field.
2. `assets/js/app.js` — render the new link in the footer/contact page.

## Adding another content section

A developer will generally need to:

1. Add a content file under `content/`.
2. Add a collection/field definition to `admin/config.yml`.
3. Create a new HTML page.
4. Add a renderer in `assets/js/app.js`.
5. Add navigation logic.
6. Style the section in `assets/css/style.css`.

## Changing the CMS backend

The default backend is GitHub:

```yaml
backend:
  name: github
  repo: owner/repository
  branch: main
```

An optional `admin/config-turbo-example.yml` file is included as a reference starting point for Decap Turbo.

Always check the latest Decap CMS documentation before changing backend/authentication settings.

## Adding a custom domain

Custom domains are configured through your hosting provider, not through this codebase.

After changing the public domain, check any OAuth application settings that reference the old Homepage URL.

## Making a branded version for clients

For client projects, you can:

- replace sample content
- choose a default theme
- add a client logo or profile image
- hide unused sections
- add custom page wording
- connect the client's repository and hosting account

Keep client OAuth secrets outside the repository.
