# Beginner Setup Guide

You can make your website without editing code or setting up GitHub.

## 1. Open the editor

Extract the downloaded template ZIP. Open the `editor` folder and double-click `index.html`. On Windows you can also double-click `OPEN EDITOR.cmd` in the main folder.

Keep the extracted files together. The editor runs locally in your browser and needs no installation or sign-in.

## 2. Make it yours

Fill in Profile, choose a theme and upload a photo if you want one. Open Projects, Writing and Notes to replace the examples. Remove anything you do not want. New entries start as drafts: check **Include in website** when they are ready.

Use the preview page selector and Mobile button to review your work. Hide unused sections in Profile.

## 3. Save your editable work

Click **Save backup**. Keep the JSON file somewhere safe. It includes your drafts and uploaded photo. Use **Open backup** when moving computers or restoring your work.

The editor attempts browser autosave, but a backup is your reliable separate copy. Do not upload it to public hosting.

## 4. Download your website

Click **Download website**. Fix any validation message and try again. You will receive `my-portfolio-website.zip` containing your public pages and assets, with drafts and hidden sections excluded.

To check it offline, extract this website ZIP and open its `index.html`.

## 5. Put it online

Choose a static hosting provider. One option is Cloudflare Pages Direct Upload, which accepts a ZIP through its dashboard. Follow the [official instructions](https://developers.cloudflare.com/pages/get-started/direct-upload/).

Upload the exported website ZIP, not this entire template folder and not your backup. If your host accepts individual files, extract the website ZIP and upload its contents with `index.html` at the published root.

## 6. Update later

Reopen the editor, open your latest backup if necessary, make changes, save another backup and download a fresh website. Upload that complete new website as a replacement deployment.

Checking **Include in website** does not publish to the internet by itself. Each update needs another upload.

See the [full editor guide](PORTABLE_EDITOR.md) for article formatting, recovery and limits. The [advanced CMS setup](NETLIFY_SETUP.md) is optional and uses a different workflow.
