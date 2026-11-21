# Quote Form Setup: Send Quote Requests to a Google Sheet

Every quote request from the website's **Contact** page becomes a new row in a Google Sheet, and an email alert is sent for each one. It uses a free Google Apps Script, with no extra hosting or monthly cost.

**How it works:** visitor submits the quote form → the website sends the details to your Apps Script web app → the script checks them, adds a row to the sheet and emails you.

**Until this is set up**, the form still checks what visitors type, but shows them a "not yet connected" notice with a summary to copy. Nothing is delivered anywhere.

**You need:**

- A Google account (ideally the business's, so the client owns the data)
- Access to this GitHub repository's **Settings**
- About 15 minutes

---

## Step 1: Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) while signed in to the business Google account.
2. Create a **Blank spreadsheet**.
3. Name it **Skylark Quote Requests**.

Don't add headers. The script creates a tab called **Quotes** with bold, frozen headers the first time a quote arrives.

## Step 2: Add the script

1. In the sheet, click **Extensions → Apps Script**.
2. Delete everything in the editor.
3. Open [`google-apps-script/Code.gs`](google-apps-script/Code.gs) in this repository, click the **Copy raw file** button, and paste it into the editor.
4. Near the top, change `you@example.com` to the email that should get quote alerts. Use `''` to turn emails off.
5. Click the **Save** icon.

The script's address can be seen in the website's code, so the script re-checks every submission and accepts at most 30 per hour (`MAX_PER_HOUR`). That stops bots from filling the sheet with junk.

## Step 3: Publish the script as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
4. Click **Deploy**, then **Authorize access**, and pick the Google account.
5. If Google warns "Google hasn't verified this app", click **Advanced → Go to (project name)**. It appears because this is your own private script; it is safe.
6. Copy the **Web app URL**. It ends in `/exec`.

Paste the URL into a browser tab. If you see "Skylark quote webhook is running.", the script is live.

## Step 4: Connect it to the website

The website reads the URL from a GitHub repository variable when it is built.

1. In this repository, open **Settings → Secrets and variables → Actions**.
2. Open the **Variables** tab and click **New repository variable**.
3. Name: `QUOTE_WEBHOOK_URL`. Value: the web app URL from Step 3.
4. Click **Add variable**.
5. Go to **Actions → Deploy to GitHub Pages → Run workflow → Run workflow** to rebuild the site with the new setting.

After about two minutes, the live site sends every quote to the sheet. Visitors then see "Your quote request has been delivered" instead of the "not yet connected" notice.

## Step 5: Test it

1. Open the live site's **Contact** page and submit a quote with your own details.
2. Check the **Quotes** tab: a new row should appear within seconds.
3. Check your inbox for the alert email (and the spam folder the first time).
4. Delete the test row.

---

## Everyday use

- **Track jobs:** each new row starts with Status "New". Change it to "Quoted", "Booked" or "Lost" as you work through requests.
- **Reply to a customer:** reply to the alert email; it goes straight to the customer's address.

## Changing the script later

Saving is not enough. In Apps Script go to **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same, so nothing changes on the website.

## Testing on your own computer

Create a file called `.env` (a copy of `.env.example`) and add:

```
VITE_QUOTE_WEBHOOK_URL="https://script.google.com/macros/s/…/exec"
```

Restart `npm run dev`. Never upload `.env` to GitHub.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Site still says "not yet connected" | Check the variable is named exactly `QUOTE_WEBHOOK_URL`, then re-run the Deploy workflow. |
| Site says it "could not confirm delivery" | Open the URL in a browser. No "running" message → redo Step 3 and check **Who has access** is **Anyone**. |
| Row added but no email | Check `NOTIFY_EMAIL` and the spam folder. Free Google accounts can send about 100 emails a day. |
| Edits to the script have no effect | Publish a new version (see "Changing the script later"). |
| Sheet filling with junk | Lower `MAX_PER_HOUR`, publish a new version, and delete the junk rows. |
