# Security Policy

## Portable editor and exports

The browser editor keeps work on the user's computer. Browser autosave is not an access control mechanism; anyone using that browser profile may be able to open the saved work. Backup JSON includes drafts and uploaded photos. Keep backups private and publish only the exported website ZIP.

Static exports exclude drafts and hidden sections entirely. Raw article HTML is escaped; supported Markdown is rendered without accepting raw HTML. Public links are limited to HTTP(S). Remote profile image URLs contact their external host; use photo upload for a self-contained website.

For repository/CMS deployments, build with `node tools/build-site.cjs --cms` and publish only `dist/`. Serving the repository root exposes the source JSON, including drafts. A public GitHub repository also exposes drafts in its files and history, even when the public site export excludes them. Use a private repository for unpublished material.

When removing a published article, replace the entire deployment with a new export. Removing a page from a new ZIP does not delete an old copy if a host merges uploaded files. Previously published material may remain in search caches or archives.

## Supported version

Security fixes are intended for the latest version of the template.

## Never commit secrets

Do not store any of the following in repository files:

- passwords
- GitHub personal access tokens
- OAuth Client Secrets
- API keys
- private database credentials
- private SSH keys
- confidential personal data

The GitHub OAuth Client Secret used for Decap CMS authentication should be stored only in the hosting provider's secure OAuth configuration.

## Repository access

The default Decap CMS GitHub backend requires CMS users to have push access to the content repository.

Only grant repository write access to people who should be able to change the website.

Remove access when it is no longer needed.

## Admin URL

The `/admin/` path is public in the sense that anyone can navigate to it. Authentication controls who can save changes.

Do not treat an obscure admin URL as a security mechanism.

## Content safety

Assume that content committed to a public repository can be read by anyone, even if it is not currently displayed on the site.

Avoid placing private drafts or sensitive material in a public repository.

## Third-party services

This project may rely on third-party services including GitHub, Netlify, Decap CMS CDN resources, and optional integrations added by site owners.

Review provider security/privacy settings before adding analytics, forms, comments, newsletters, or third-party scripts.

## Reporting a vulnerability

If you discover a security issue in a public fork of this template, avoid posting secrets or exploitable private details in a public issue. Contact the maintainer privately when a suitable private channel is available.
