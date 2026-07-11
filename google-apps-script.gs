const NOTIFY_EMAIL = "adhkanchan4@gmail.com";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    let responses = ss.getSheetByName("RSVP Responses");
    if (!responses) {
      responses = ss.insertSheet("RSVP Responses");
      responses.appendRow(["Timestamp", "Full Name", "Attendance", "Message"]);
    }

    const timestamp = new Date();
    const fullName = String(data.fullName || "").trim();
    const attendance = String(data.attendance || "").trim();
    const message = String(data.message || "").trim();

    responses.appendRow([timestamp, fullName, attendance, message]);

    let guests = ss.getSheetByName("Guest List");
    if (!guests) {
      guests = ss.insertSheet("Guest List");
      guests.appendRow(["Invited Guest Name", "Status", "Response Time"]);
      guests.appendRow(["Add invited names here", "Pending", ""]);
    }

    const lastRow = guests.getLastRow();
    if (lastRow >= 2) {
      const guestNames = guests.getRange(2, 1, lastRow - 1, 1).getValues();
      const normalized = fullName.toLowerCase().replace(/\s+/g, " ");

      for (let i = 0; i < guestNames.length; i++) {
        const sheetName = String(guestNames[i][0] || "").trim().toLowerCase().replace(/\s+/g, " ");
        if (sheetName && sheetName === normalized) {
          guests.getRange(i + 2, 2).setValue(attendance);
          guests.getRange(i + 2, 3).setValue(timestamp);
          break;
        }
      }
    }

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "New Engagement RSVP: " + fullName,
      htmlBody:
        "<h2>New RSVP Received</h2>" +
        "<p><strong>Name:</strong> " + escapeHtml(fullName) + "</p>" +
        "<p><strong>Response:</strong> " + escapeHtml(attendance) + "</p>" +
        "<p><strong>Message:</strong> " + escapeHtml(message || "No message") + "</p>"
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function setupGuestList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let guests = ss.getSheetByName("Guest List");
  if (!guests) {
    guests = ss.insertSheet("Guest List");
    guests.appendRow(["Invited Guest Name", "Status", "Response Time"]);
  }

  let responses = ss.getSheetByName("RSVP Responses");
  if (!responses) {
    responses = ss.insertSheet("RSVP Responses");
    responses.appendRow(["Timestamp", "Full Name", "Attendance", "Message"]);
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
