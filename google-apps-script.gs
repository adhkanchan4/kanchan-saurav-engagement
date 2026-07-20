const SHEET_NAME = "RSVP Responses";
const NOTIFICATION_EMAIL = "YOUR_EMAIL_ADDRESS@gmail.com";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Full Name", "Attendance", "Message"]);
      sheet.setFrozenRows(1);
    }
    const timestamp = new Date();
    sheet.appendRow([timestamp, data.name || "", data.attendance || "", data.message || ""]);
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: "New engagement RSVP from " + (data.name || "Guest"),
      htmlBody: "<b>Name:</b> " + escapeHtml(data.name) + "<br><b>Attendance:</b> " + escapeHtml(data.attendance) + "<br><b>Message:</b> " + escapeHtml(data.message || "None")
    });
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(error)})).setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet(){ return ContentService.createTextOutput("Kanchan & Saurav RSVP endpoint is active."); }
function escapeHtml(value){ return String(value || "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
