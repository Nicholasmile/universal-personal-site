# Universal Personal Website Template

A beginner-friendly personal website, blog, and portfolio template that can be managed from a browser without editing code after the initial setup.

The project is designed for writers, students, researchers, freelancers, developers, designers, consultants, creators, and professionals who want a simple website they control.

## What you get

- Home page
- About page
- Writing / blog section
- Individual article reader
- Portfolio / projects section
- Short notes section
- Contact page
- Browser-based `/admin/` editor powered by Decap CMS
- Image uploads
- Five built-in colour themes
- Controls to show or hide Writing, Portfolio, and Notes
- Responsive layout for desktop, tablet, and mobile
- Netlify configuration for static deployment
- Security headers for the deployed site
- No application database
- No Node.js build step
- No Python or Quarto required for the public website

## Who is this for?

Use the same template as a:

- personal website
- writing/blog site
- student profile
- research website
- freelance portfolio
- developer portfolio
- consulting profile
- creator website
- professional landing page

## How it works

```text
Website owner
    ↓
/admin/ dashboard
    ↓
Decap CMS
    ↓
GitHub repository
    ↓
Netlify automatic deployment
    ↓
Public website
```

The public site is plain HTML, CSS, and JavaScript. Content is stored in JSON files inside the repository. Decap CMS provides the browser-based editor and commits approved changes back to GitHub. Netlify detects the GitHub update and deploys the new version of the site.

## Quick start

For the complete beginner walkthrough, read:

**[Beginner Setup Guide](docs/BEGINNER_SETUP.md)**

The basic process is:

1. Create a GitHub repository.
2. Upload this template.
3. Update `admin/config.yml` with your exact GitHub username and repository name.
4. Import the repository into Netlify.
5. Create a GitHub OAuth App.
6. Add the OAuth credentials to your Netlify project.
7. Visit `https://your-site.netlify.app/admin/`.
8. Sign in with GitHub and edit the website from your browser.

## Local preview

### Windows — easiest method

Double-click:

```text
OPEN WEBSITE.cmd
```

The launcher starts a small local web server and opens the site in your browser.

### Any operating system with Python

From the project folder:

```bash
python -m http.server 8000
```

On some macOS/Linux systems use:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://127.0.0.1:8000
```

Do not rely on double-clicking `index.html`. Modern browsers usually block the local `fetch()` requests used to load the JSON content when a page is opened through `file://`.

## Admin dashboard

After online setup, visit:

```text
https://YOUR-SITE.netlify.app/admin/
```

The admin can manage:

### Website Settings

- name
- tagline
- homepage introduction
- biography
- location
- email
- profile image
- colour theme
- section visibility
- social links

### Writing

- title
- URL slug
- date
- category
- description
- featured status
- published/draft status
- Markdown article body

### Portfolio

- title
- category
- description
- project URL
- featured status
- published/draft status

### Notes

- date
- short note
- published/draft status

Read the **[Admin User Guide](docs/ADMIN_GUIDE.md)** for the full browser-editing workflow.

## Built-in themes

Choose one from the admin dashboard:

- Forest
- Navy
- Wine
- Sand
- Charcoal

Developers can add or change themes in `assets/css/style.css`.

## Project structure

```text
universal-personal-site-template/
│
├── index.html                 # Home
├── about.html                 # About
├── writing.html               # Article listing
├── article.html               # Individual article reader
├── portfolio.html             # Projects
├── notes.html                 # Short notes
├── contact.html               # Contact information
├── 404.html                   # Friendly not-found page
│
├── admin/
│   ├── index.html             # Decap CMS loader
│   ├── config.yml             # CMS fields + GitHub repository configuration
│   └── config-turbo-example.yml
│
├── assets/
│   ├── css/style.css          # Site design
│   ├── js/app.js              # Content loading and page rendering
│   └── images/
│       ├── profile-placeholder.svg
│       └── uploads/           # Images uploaded through the CMS
│
├── content/
│   ├── site.json              # Profile and site settings
│   ├── posts.json             # Articles
│   ├── projects.json          # Portfolio projects
│   └── notes.json             # Short notes
│
├── docs/                      # Documentation
├── netlify.toml               # Netlify publish + security headers
├── robots.txt
├── OPEN WEBSITE.cmd           # Easy Windows local preview
├── START HERE.txt             # Very short first-run instructions
├── README.md
├── SECURITY.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

## Content model

The website deliberately uses simple JSON files instead of a database.

- `content/site.json` — personal details and design options
- `content/posts.json` — blog posts/articles
- `content/projects.json` — portfolio entries
- `content/notes.json` — short notes

Most users should edit these through `/admin/`, not by opening the JSON files manually.

## Publishing workflow

Once everything is configured, normal publishing is simple:

```text
Open /admin/
→ Edit content
→ Publish
→ Decap commits to GitHub
→ Netlify deploys automatically
→ Updated website goes live
```

A GitHub login is required by the default CMS backend, and the logged-in GitHub user must have push access to the repository.

## Documentation

- **[Beginner Setup Guide](docs/BEGINNER_SETUP.md)** — from ZIP file to a live website
- **[Admin User Guide](docs/ADMIN_GUIDE.md)** — write and update content without coding
- **[Customization Guide](docs/CUSTOMIZATION.md)** — themes, text, layout, and branding
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** — common errors and fixes
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** — architecture and technical notes
- **[Security Policy](SECURITY.md)** — secrets, access, and safe deployment
- **[Contributing](CONTRIBUTING.md)** — how to improve the template

## Important setup detail

In `admin/config.yml`, this line must match the GitHub repository exactly:

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/YOUR_REPOSITORY
  branch: main
```

Example:

```yaml
backend:
  name: github
  repo: janedoe/my-personal-site
  branch: main
```

A mismatch causes Decap CMS to report that the repository cannot be found.

## Privacy and security

Never store passwords, API keys, GitHub tokens, OAuth client secrets, private credentials, or confidential data inside this repository.

The GitHub OAuth **Client Secret belongs in Netlify's secure OAuth configuration**, not in `config.yml` or any HTML/JavaScript file.

See [SECURITY.md](SECURITY.md) for more guidance.

## Deployment notes

This is a static site. Netlify does not need a build command.

The included `netlify.toml` publishes the project root:

```toml
[build]
  publish = "."
```

## Current CMS authentication model

The default configuration uses Decap CMS's GitHub backend. It expects:

- the site repository to be on GitHub
- a GitHub OAuth App
- GitHub OAuth configured in Netlify
- CMS users to have push access to the repository

The included `admin/config-turbo-example.yml` is an optional starting point for users who prefer Decap Turbo instead.

## Browser support

Use a current version of Chrome, Edge, Firefox, or Safari.

## License

This template is released under the MIT License. See [LICENSE](LICENSE).

You may use it for personal projects, client work, education, experiments, or commercial websites, subject to the license terms.

## Project status

**Version: 1.0.0**

The template is intentionally lightweight. Feature ideas and contributions are welcome.

## Maintainer

Created and maintained by **Malik Kolade**.
