# Troubleshooting

## Portable editor

- **Nothing opens:** extract the template ZIP before opening `editor/index.html`. Keep the template folders together.
- **Preview stops updating:** read the validation message above the preview. Fix the invalid profile, link, article address or date. Draft entries can remain unfinished.
- **Changes disappeared:** open your latest backup. Browser autosave depends on the browser profile and may be cleared; moving the template can also change its storage location.
- **Photo rejected:** use PNG, JPEG or WebP smaller than 2 MB.
- **Downloads blocked:** allow downloads for your local editor. Save backup and Download website are separate downloads.
- **Changes are not online:** upload a new website ZIP as a replacement deployment. The editor does not publish automatically.
- **A removed article remains online:** replace the complete deployment; do not merge the export into the old files.
- **Advanced Markdown looks different:** see [supported article formatting](PORTABLE_EDITOR.md). Raw HTML is intentionally shown as text.

The remaining troubleshooting sections apply to the optional CMS and legacy source preview.

Common problems and their fixes.

## 1. “Repo not found” in the admin dashboard

### Cause

The repository value in `admin/config.yml` is wrong, or the GitHub user does not have access.

### Fix

Open your GitHub repository and copy the owner/repository names exactly.

If the repository URL is:

```text
https://github.com/janedoe/my-personal-site
```

use:

```yaml
repo: janedoe/my-personal-site
```

Also confirm that the account used to log into `/admin/` has push access.

---

## 2. Login with GitHub appears, but login fails

Check:

- the GitHub OAuth App exists
- the Client ID is correct in Netlify
- the Client Secret is correct in Netlify
- the Client Secret was not copied with extra spaces
- the OAuth callback URL is exactly:

```text
https://api.netlify.com/auth/done
```

Do not put the Client Secret in the repository.

---

## 3. I cannot find GitHub Developer settings

Use your personal GitHub account settings, then scroll to **Developer settings**.

You are looking for:

```text
Developer settings → OAuth Apps
```

This is separate from GitHub's Developer Program registration page.

---

## 4. The site works online but not when I double-click index.html

The website loads JSON using browser `fetch()`.

Browsers commonly block those requests on `file://` pages.

Use:

```text
OPEN WEBSITE.cmd
```

on Windows, or run a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```

---

## 5. I published an article but cannot see it

Check:

- `Published` is enabled
- the article has a unique slug
- Netlify finished the latest deployment
- the browser is not showing a cached page

Refresh the site after the deployment finishes.

---

## 6. A project is missing

Confirm that the project's `Published` switch is enabled.

If the project should appear prominently on the homepage, enable `Featured`.

---

## 7. My profile image is broken

Try uploading the image again through the CMS.

Uploaded files should be stored under:

```text
assets/images/uploads/
```

Avoid deleting an uploaded image from GitHub while the website still references it.

---

## 8. The admin page is blank

Check your browser developer console and internet connection.

`admin/index.html` loads Decap CMS from a CDN, so the admin interface requires internet access.

Also confirm that this file still contains the Decap CMS script.

---

## 9. Netlify deployed but the old content is still visible

Try:

1. Wait for the deployment to show as complete.
2. Hard-refresh the browser.
3. Open the site in a private/incognito window.
4. Check that the CMS commit reached the expected GitHub branch.
5. Confirm `branch: main` matches the repository's actual publishing branch.

---

## 10. Netlify asks for a build command

The optional CMS deployment builds static HTML before publishing.

Use:

```text
Build command:       node tools/build-site.cjs --cms
Publish directory:   dist
```

The included `netlify.toml` sets both options. Do not publish the source repository root.

---

## 11. My GitHub repository is private

The GitHub backend can work with repositories the authenticated user can access. Ensure:

- Netlify has permission to the repository
- the GitHub user logging into the CMS has push access
- the OAuth flow has the permissions required by the backend

For the simplest beginner setup, a public repository for a public static site avoids many permission questions.

---

## 12. I renamed or transferred the repository

Update:

```text
admin/config.yml
```

so `repo:` matches the new owner/name.

You may also need to reconnect hosting permissions depending on how the repository was transferred.

---

## 13. OAuth worked before changing domains

Check the GitHub OAuth App's Homepage URL and your hosting configuration.

When Netlify is still handling the OAuth provider, the callback URL remains:

```text
https://api.netlify.com/auth/done
```

---

## Still stuck?

When reporting a problem, include:

- the exact error message
- which step failed
- whether the public site works
- whether `/admin/` loads
- whether GitHub received the latest CMS commit
- whether Netlify completed the latest deployment

Never include OAuth Client Secrets, passwords, access tokens, or private credentials in support messages.
