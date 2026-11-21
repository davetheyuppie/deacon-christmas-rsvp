# Deacons' Christmas Party RSVP

A one-page Astro site where people RSVP (name, number attending, side dish or dessert) and see what everyone else is bringing. No sign-in. RSVPs are stored in the Google Sheet "Deacons' Christmas Party Sign-Up" through a small Google Apps Script.

## One-time setup

### 1. Connect the sheet (Apps Script)
1. Open the sign-up sheet in Google Sheets.
2. **Extensions → Apps Script.** Delete what's in `Code.gs` and paste in [`apps-script/Code.gs`](apps-script/Code.gs). Save.
3. **Deploy → New deployment.** Choose the gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** and approve the permissions prompt. Google warns that the app isn't verified because you wrote it yourself: choose **Advanced → Go to (project name)**.
5. Copy the **Web app URL** (it ends in `/exec`).

### 2. Point the site at it
Paste the URL into `SCRIPT_URL` in [`src/config.ts`](src/config.ts). Fill in the date, time and place there too if you like.

### 3. Publish on GitHub Pages
1. Create a GitHub repo named `deacon-christmas-rsvp` and push this folder to `main`.
2. In the repo: **Settings → Pages → Source: GitHub Actions.**
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push. The site will be at `https://davetheyuppie.github.io/deacon-christmas-rsvp/`.

If you name the repo something else, change `base` in `astro.config.mjs` to `/<repo-name>`.

## Notes
- Each browser remembers its own RSVP, so people can come back on the same device to change or cancel it.
- The page refreshes the list every 30 seconds while it's open.
- Once the page is live, you can turn the sheet's sharing back to **Restricted**. The script still works because it runs as you.
- If you change `Code.gs`, use **Deploy → Manage deployments → Edit → New version** so the same URL keeps working.

## Local preview
```bash
npm install
npm run dev
```
With `SCRIPT_URL` empty, the page shows sample data and doesn't save anything.
