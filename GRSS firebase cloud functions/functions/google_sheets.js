const { google } = require('googleapis');
const functions = require('firebase-functions');

// Using JWT to get authentication client instance
function getJwtClient() {
  return new google.auth.JWT(
    functions.config().privatekey.client_email,
    null,
    functions.config().privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']);
}

function appendToSpreadSheet(spreadsheetId, sheetId, data) {
  const auth = getJwtClient();
  const sheets = google.sheets({ version: 'v4', auth });
  
  sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetId
  }, (err, res) => {
    const length = res.data.values ? res.data.values.length : 0;
    sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetId}!A${length + 1}`,
      valueInputOption: 'RAW',
      resource: {
        values: [data]
      }
    });
  });
}

module.exports = {
  appendToSpreadSheet
}