# Publish Portfolio Studio on Cloudflare Pages

This publishes the browser editor for everyone to use. Visitors receive the generic template and save edits in their own browser. It does not publish the portfolio currently saved in your local browser.

1. Sign in at https://dash.cloudflare.com/. If you do not have an account, create one yourself.
2. In Workers & Pages, choose Create application and find Pages Direct Upload / Drag and drop your files.
3. Name the project, for example `portfolio-studio-malik`, and upload `portfolio-studio-public.zip` from this template folder.
4. Choose Deploy site. Cloudflare will show the actual public `pages.dev` URL after deployment.

There is no build command for this uploaded ZIP. It contains index.html at the root and includes the offline template download. It has no dependency on ChatGPT or Netlify. Visitors do not need your Cloudflare account to use it.

The project name's availability determines the final URL. Do not share an assumed URL before the deployment succeeds.

For updates, create a new complete deployment using a new public editor ZIP. Direct Upload projects cannot later switch to Git integration without creating another project.

Official instructions: https://developers.cloudflare.com/pages/get-started/direct-upload/

## Maintainer preparation

```text
node tools/package-template.cjs
node tools/prepare-hosted-studio.cjs
node tools/package-public-editor.cjs
```

`portfolio-template.zip` is for people who want to edit offline. `portfolio-studio-public.zip` is the public editor deployment. The website ZIP produced inside the editor is an individual visitor's portfolio. Keep these three downloads separate.
