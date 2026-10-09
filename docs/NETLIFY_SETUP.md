# Advanced Netlify and Decap CMS Setup

This is the optional GitHub-backed workflow. For editing without GitHub, OAuth or Netlify, use the [portable editor guide](PORTABLE_EDITOR.md).

This guide is for someone who wants to use the template without needing to understand web development.

You will set up the website once. After setup, most updates happen from the browser-based admin dashboard.

## What you need

Before starting, create these free accounts if you do not already have them:

- a GitHub account
- a Netlify account

You also need the template files downloaded and extracted on your computer.

---

## Part 1 — Preview the website on your computer

### Windows

1. Extract the ZIP file.
2. Open the extracted folder.
3. Double-click `OPEN WEBSITE.cmd`.
4. Keep the black terminal window open.
5. Your browser should open the site at `http://127.0.0.1:8000`.

If nothing opens automatically, type this address into your browser:

```text
http://127.0.0.1:8000
```

### macOS/Linux or manual preview

Open a terminal in the project folder and run:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://127.0.0.1:8000
```

Local preview is optional. You can continue directly to GitHub and Netlify.

---

## Part 2 — Create the GitHub repository

1. Sign in to GitHub.
2. Create a new repository.
3. Give it a simple name, for example:

```text
my-personal-site
```

4. Public is simplest for a public website. A private repository can also be used when your hosting and CMS permissions are configured correctly.
5. If GitHub asks whether to add a README, `.gitignore`, or license during repository creation, leave those unchecked because the template already includes these project files.
6. Create the repository.

---

## Part 3 — Upload the template

Inside the new GitHub repository:

1. Select **Add file**.
2. Select **Upload files**.
3. Upload the contents of the extracted template folder.
4. Confirm that folders such as `admin`, `assets`, `content`, and `docs` are visible.
5. Commit the upload.

The website source is now stored on GitHub.

---

## Part 4 — Tell the admin dashboard which repository to use

In GitHub, open:

```text
admin/config.yml
```

Select the edit/pencil button.

Find:

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/YOUR_REPOSITORY
  branch: main
```

Replace only the repository value.

For example, if the repository page is:

```text
https://github.com/janedoe/my-personal-site
```

use:

```yaml
backend:
  name: github
  repo: janedoe/my-personal-site
  branch: main
```

Commit the change.

### Important

The value must match GitHub exactly:

```text
GitHubUsername/RepositoryName
```

A wrong username or repository name produces a **Repo not found** error in the CMS.

---

## Part 5 — Deploy the website on Netlify

1. Sign in to Netlify.
2. Select **Add new project**.
3. Choose **Import an existing project**.
4. Choose GitHub.
5. Allow Netlify to access the repository if prompted.
6. Select the repository containing this template.

The public site is static. A small Node.js build generates HTML and excludes drafts and hidden sections before deployment.

Use:

```text
Build command:       node tools/build-site.cjs --cms
Publish directory:   dist
```

The included `netlify.toml` sets these build and publish options. Never publish the repository root: source JSON may include drafts. A public GitHub repository still makes those source drafts visible; use a private repository for unpublished material.

Publish/deploy the site.

Netlify will give you an address similar to:

```text
https://your-project-name.netlify.app
```

Open it and confirm that the public website loads.

---

## Part 6 — Create a GitHub OAuth App

The admin dashboard needs permission to save your changes back to GitHub.

In GitHub:

1. Open your profile menu.
2. Open **Settings**.
3. Scroll to **Developer settings**.
4. Open **OAuth Apps**.
5. Select **New OAuth App** or **Register a new application**.

Fill the form as follows.

### Application name

Use any clear name, for example:

```text
My Website CMS
```

### Homepage URL

Use your Netlify website address:

```text
https://your-project-name.netlify.app
```

### Application description

Optional. Example:

```text
Admin login for my personal website
```

### Authorization callback URL

Use:

```text
https://api.netlify.com/auth/done
```

Register the application.

GitHub will show a **Client ID**.

Generate a **Client Secret** as well.

### Keep the secret private

Do not paste the Client Secret into:

- GitHub repository files
- `admin/config.yml`
- HTML
- JavaScript
- a public issue
- screenshots shared publicly

You will enter it directly into Netlify in the next part.

---

## Part 7 — Add GitHub OAuth to Netlify

Open your site/project in Netlify.

Look for the OAuth configuration under your project security settings. Netlify currently documents this under a path similar to:

```text
Project configuration → Security / Access & security → OAuth
```

Under **Authentication Providers**:

1. Select **Install Provider**.
2. Choose **GitHub**.
3. Enter the GitHub OAuth **Client ID**.
4. Enter the GitHub OAuth **Client Secret**.
5. Save/install the provider.

Interface labels may change over time; use Netlify's OAuth provider documentation if the menu wording is different.

---

## Part 8 — Log into the website admin

Open:

```text
https://your-project-name.netlify.app/admin/
```

Choose **Login with GitHub**.

Approve access if GitHub asks.

The GitHub account signing into Decap CMS must have push access to the repository.

If login succeeds, you should see sections such as:

- Website Settings
- Writing
- Portfolio
- Notes

Your no-code editing workflow is now active.

---

## Part 9 — Make the website yours

Start with **Website Settings → Profile & Website**.

Replace the sample information with your own:

- name
- tagline
- introduction
- biography
- location
- email
- profile image
- social links
- theme

Save/publish the changes.

Netlify should automatically deploy the new version after Decap commits the change to GitHub.

---

## Part 10 — Publish your first article

Open the **Writing** section in the CMS.

Open the **Articles** content file and add an article to the list.

Recommended fields:

```text
Title:       Welcome to My Website
URL slug:    welcome
Date:        today's date
Category:    Personal
Description: A short introduction to my new website.
Featured:    enabled if you want to prioritize it on the homepage
Published:   enabled
```

Write the article in the body editor and publish.

Then open the public Writing page and confirm that it appears.

---

## Part 11 — Optional custom domain

The Netlify address is enough to use the website.

Later you can connect a domain such as:

```text
yourname.com
```

Follow Netlify's current custom-domain documentation when you are ready.

If you change the primary website domain, update the Homepage URL of your GitHub OAuth App if needed. The callback remains Netlify's OAuth callback when using Netlify's OAuth provider service.

---

## Your normal workflow after setup

You should rarely need GitHub settings again.

Normal publishing becomes:

```text
1. Visit /admin/
2. Sign in
3. Edit your website or article
4. Publish
5. Wait for Netlify to deploy
6. View the update on the public site
```

Read [ADMIN_GUIDE.md](ADMIN_GUIDE.md) next.
