# Universal Personal Website Template

A reusable personal website for writers, students, researchers, freelancers, creators, and professionals.

## What makes it beginner-friendly

The public website is plain HTML/CSS/JavaScript. There is no build step, Node.js, Python, Quarto, database, or command line requirement for the site owner after setup.

Content lives in four simple JSON files. Decap CMS provides a browser-based `/admin/` editor for changing the profile, writing, portfolio, notes, and images.

## Pages included

- Home
- About
- Writing
- Article reader
- Portfolio
- Notes
- Contact
- `/admin/` content editor

## Built-in customisation

The admin can change:

- name and tagline
- homepage introduction
- biography and location
- profile photo
- email and social links
- theme preset: Forest, Navy, Wine, Sand, or Charcoal
- visibility of Writing, Portfolio, and Notes
- articles
- projects
- short notes

## Preview locally

Because browsers block `fetch()` from `file://`, do not double-click `index.html` for a full preview.

Use any simple local web server, for example VS Code Live Server. You can also deploy the folder directly to Netlify.

## Deploy without a build system

This template is a static site. On Netlify, publish the repository root. `netlify.toml` already sets the publish directory to `.`.

## Turn on the admin editor

The included `admin/config.yml` uses Decap CMS's GitHub backend. One setup step is required:

1. Put the site in a GitHub repository.
2. Open `admin/config.yml` once and replace `YOUR_GITHUB_USERNAME/YOUR_REPOSITORY` with the repository name.
3. Configure GitHub authentication for Decap CMS with your hosting provider, or use Decap Turbo.
4. Visit `https://your-site.com/admin/` and sign in.

After that, normal editing happens entirely in the browser.

### Important 2026 note

Netlify Git Gateway is deprecated for new configurations, so this starter does not depend on Git Gateway. The default config uses Decap's direct GitHub backend. Decap Turbo is also supported as an optional route; its current backend is beta, so the stable GitHub backend remains the default in this starter.

## For a template business

A polished product version could add:

- onboarding wizard
- custom domain guidance
- more theme presets
- newsletter integration
- contact form handling
- analytics
- SEO controls
- image galleries
- testimonials
- resume/CV section
- service pages

## Content files

- `content/site.json` — profile and design settings
- `content/posts.json` — articles
- `content/projects.json` — portfolio
- `content/notes.json` — short notes

## Security reminder

Never place passwords, API keys, private tokens, or sensitive personal information in repository files. Treat repository content as publishable unless the repository and deployment are deliberately private.
