# Connect the RSVP form to Google Sheets

1. Create a new Google Sheet.
2. Open **Extensions → Apps Script**.
3. Delete the starter code and paste everything from `google-apps-script.gs`.
4. Replace `YOUR_EMAIL_ADDRESS@gmail.com` with the email that should receive RSVP notifications.
5. Click **Deploy → New deployment**.
6. Choose **Web app**.
7. Set **Execute as:** Me.
8. Set **Who has access:** Anyone.
9. Deploy and authorize the script.
10. Copy the Web App URL ending in `/exec`.
11. Open `script.js` and replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.
12. Upload the whole folder to GitHub or drag it into Netlify.

The sheet will automatically store the timestamp, guest name, attendance response, and optional message. An email notification is sent for every RSVP.
