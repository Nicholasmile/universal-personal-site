# From Portfolio Studio to Your Live Cloudflare Website

Start with the [complete step-by-step guide](https://portfolio-studio-malik.pages.dev/deploy.html). An offline copy is included at `editor/deploy.html` and can be printed or saved as PDF from a browser.

The guide covers the full journey:

1. Open https://portfolio-studio-malik.pages.dev/ and edit your profile.
2. Replace the example projects, writing and notes. Check **Include in website** for ready entries and hide unused sections in Profile.
3. Check each page in the preview and use Mobile to check narrow screens.
4. Click **Save backup** and keep `my-portfolio-backup.json` private for future editing.
5. Click **Download website** and find `my-portfolio-website.zip` in Downloads. This is the ZIP to upload; the offline template ZIP and backup JSON are different files.
6. Open https://dash.cloudflare.com/, sign in or create your own account, and verify your email if asked. After verification, use a new dashboard tab or sign in again if the prompt remains.
7. Open **Compute → Workers & Pages → Create application**. If the screen says Make something new, choose **Continue to Pages**. Under **Drag and drop your files**, choose **Get started**.
8. Choose your own project name and click **Create project**. Click **file** or drag in `my-portfolio-website.zip`. Wait for all files to upload successfully, then click **Deploy site**.
9. When Cloudflare reports success, open and share the actual `pages.dev` address it shows. Do not share the dashboard URL. Check your site on a phone and in a private window.
10. For updates, return to the editor and open your latest backup if needed. Download new backup and website files. Open the same Cloudflare project, choose **Create a new deployment**, select **Production** if asked, upload the complete fresh website ZIP, and deploy. The main site link stays the same.

You do not need GitHub, a build command or an installed development tool for this workflow. A custom domain is optional.

## Common problems

- **The published site is an editor:** you uploaded the offline template. Upload `my-portfolio-website.zip` from Download website instead.
- **No website ZIP downloaded:** fix any editor validation message and check blocked browser downloads.
- **Cloudflare requests email verification:** follow the latest verification email link, then refresh or open a new dashboard tab.
- **Cloudflare requests GitHub:** go back and choose Pages → Drag and drop your files.
- **404 page:** export a fresh ZIP and upload it directly. `index.html` belongs at the ZIP root, not in an extra folder.
- **Missing entries:** check section visibility and Include in website, then export and deploy again.
- **Updates are not visible:** editor saving does not update hosting. Upload a fresh ZIP as a new Production deployment.
- **Lost editable content:** open the backup JSON in the editor. A public website ZIP cannot be imported as an editable backup.

Cloudflare labels may change. See the [official Direct Upload instructions](https://developers.cloudflare.com/pages/get-started/direct-upload/) if your screen differs. For editor formatting and backup details, see [Portfolio Studio](PORTABLE_EDITOR.md).
