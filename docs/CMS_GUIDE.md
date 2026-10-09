# Admin User Guide

Once setup is complete, most website owners can manage the site without opening code.

Your admin dashboard is located at:

```text
https://YOUR-DOMAIN/admin/
```

## Sign in

1. Open `/admin/`.
2. Select **Login with GitHub**.
3. Sign in with the GitHub account that has push access to the website repository.

## Website Settings

Open:

```text
Website Settings → Profile & Website
```

Available fields include:

### Name

The name shown in the navigation, homepage, About page, footer, and browser title.

### Tagline

A short professional description, for example:

```text
Writer · Researcher · Designer
```

### Homepage introduction

A short statement beneath the main headline.

### About biography

The longer introduction used on the About page.

### Location

Optional city/country or broader location.

### Email

Used on the Contact page.

### Profile image

Upload an image from your computer. Decap stores uploaded images under:

```text
assets/images/uploads/
```

### Theme

Choose:

- Forest
- Navy
- Wine
- Sand
- Charcoal

### Section visibility

Use the switches to show or hide:

- Writing
- Portfolio
- Notes

Hidden sections are removed from the main navigation and relevant homepage sections.

### Social links

Add full links beginning with `https://` for:

- LinkedIn
- GitHub
- X / Twitter
- Instagram

Leave a field blank if you do not use that platform.

---

# Writing articles

Open:

```text
Writing → Articles
```

Articles are stored as a list. Add a new list item for each article.

## Article fields

### Title

Example:

```text
What I Learned Building My First Data Project
```

### URL slug

Use a short lowercase identifier with hyphens:

```text
first-data-project
```

Avoid spaces and special characters.

Each slug should be unique.

### Date

Choose the publication date.

### Category

Examples:

```text
Personal
Research
Technology
Data
Career
Design
```

### Short description

One or two sentences shown on article cards.

### Featured

Featured articles are prioritized when the homepage selects recent writing.

### Published

- enabled = visible publicly
- disabled = treated as a draft

### Article body

The body supports Markdown.

Useful Markdown examples:

```markdown
# Main heading

## Section heading

**bold text**

*italic text*

- bullet point
- another point

[Link text](https://example.com)

> A quotation
```

## Updating an article

1. Open Writing → Articles.
2. Find the article in the list.
3. Edit it.
4. Publish/save.
5. Wait for Netlify to deploy the updated GitHub commit.

## Unpublishing without deleting

Turn **Published** off.

The article stays in the content file but disappears from the public site.

---

# Portfolio projects

Open:

```text
Portfolio → Projects
```

Each project supports:

- Title
- Category
- Description
- Project link
- Featured
- Published

A project link can point to:

- GitHub
- Behance
- a case study
- a research paper
- a live product
- a PDF hosted elsewhere
- another relevant webpage

Use a complete URL beginning with `https://`.

Featured projects are prioritized on the homepage.

---

# Short Notes

Open:

```text
Notes → Short Notes
```

Notes are intended for brief thoughts that do not need a full article.

Each note has:

- date
- note text
- published status

Examples include:

- reading notes
- quick lessons
- project observations
- announcements
- short reflections

---

# Publishing and deployment

When you publish in Decap CMS:

1. Decap writes the content change to GitHub.
2. GitHub records a new commit.
3. Netlify sees the repository change.
4. Netlify deploys the updated website.

This can take a short amount of time.

If a change does not appear immediately, wait briefly and refresh the site.

For persistent problems, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

---

# Safe editing habits

- Keep article slugs unique.
- Use full `https://` links.
- Preview important changes after publishing.
- Keep a copy of important writing elsewhere as an additional backup.
- Never put passwords, access tokens, or confidential information into an article or settings field.
