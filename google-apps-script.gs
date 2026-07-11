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

    let guests = ss.getSheetByName("Guest List");
    if (!guests) {
      guests = ss.insertSheet("Guest List");
      guests.appendRow(["Invited Guest Name", "Status", "Response Time"]);
    }

    let summary = ss.getSheetByName("Headcount Summary");
    if (!summary) {
      summary = ss.insertSheet("Headcount Summary");
      summary.getRange("A1:B4").setValues([
        ["Category", "Count"],
        ["Accepted", 0],
        ["Declined", 0],
        ["Pending", 0]
      ]);
    }

    const timestamp = new Date();
    const fullName = String(data.fullName || "").trim();
    const attendance = String(data.attendance || "").trim();
    const message = String(data.message || "").trim();

    responses.appendRow([timestamp, fullName, attendance, message]);

    const lastRow = guests.getLastRow();
    if (lastRow >= 2) {
      const names = guests.getRange(2, 1, lastRow - 1, 1).getValues();
      const normalized = normalizeName(fullName);

      for (let i = 0; i < names.length; i++) {
        if (normalizeName(names[i][0]) === normalized) {
          guests.getRange(i + 2, 2).setValue(attendance);
          guests.getRange(i + 2, 3).setValue(timestamp);
          break;
        }
      }
    }

    const counts = calculateCounts(guests);
    summary.getRange("B2:B4").setValues([
      [counts.accepted],
      [counts.declined],
      [counts.pending]
    ]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "New Engagement RSVP: " + fullName,
      htmlBody:
        "<h2>New RSVP Received</h2>" +
        "<p><strong>Name:</strong> " + escapeHtml(fullName) + "</p>" +
        "<p><strong>Response:</strong> " + escapeHtml(attendance) + "</p>" +
        "<p><strong>Message:</strong> " + escapeHtml(message || "No message") + "</p>" +
        "<hr>" +
        "<h3>Current Headcount</h3>" +
        "<p><strong>Accepted:</strong> " + counts.accepted + "</p>" +
        "<p><strong>Declined:</strong> " + counts.declined + "</p>" +
        "<p><strong>Pending:</strong> " + counts.pending + "</p>"
    });

    return ContentService
      .createTextOutput(JSON.stringify({ok:true}))
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

  let summary = ss.getSheetByName("Headcount Summary");
  if (!summary) {
    summary = ss.insertSheet("Headcount Summary");
    summary.getRange("A1:B4").setValues([
      ["Category", "Count"],
      ["Accepted", 0],
      ["Declined", 0],
      ["Pending", 0]
    ]);
  }
}

function calculateCounts(guests) {
  const lastRow = guests.getLastRow();

  if (lastRow < 2) {
    return {accepted:0, declined:0, pending:0};
  }

  const statuses = guests.getRange(2, 2, lastRow - 1, 1).getValues();
  let accepted = 0;
  let declined = 0;
  let pending = 0;

  statuses.forEach(function(row) {
    const status = String(row[0] || "Pending").trim().toLowerCase();

    if (status === "accepted") {
      accepted++;
    } else if (status === "declined") {
      declined++;
    } else {
      pending++;
    }
  });

  return {accepted:accepted, declined:declined, pending:pending};
}

function normalizeName(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g," ");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}
