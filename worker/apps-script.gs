/**
 * Google Apps Script — appends each lead to a Google Sheet.
 *
 * Setup:
 *  1. Create a Google Sheet (this becomes your lead record).
 *  2. Extensions ▸ Apps Script. Delete the sample, paste this file, Save.
 *  3. Deploy ▸ New deployment ▸ type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *     Copy the /exec web-app URL — that is your SHEET_URL secret.
 */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Leads") || ss.insertSheet("Leads");
  var d = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["When", "Budget", "Email", "Source"]);
  }
  sheet.appendRow([
    d.when || new Date().toISOString(),
    d.budget || "",
    d.email || "",
    d.source || "",
  ]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}
