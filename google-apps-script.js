function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([new Date(), e.parameter.name || "", e.parameter.attendance || "", e.parameter.message || ""]);
  return ContentService.createTextOutput("Success");
}
