const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { google } = require('googleapis');
const { FirebaseFunctionsRateLimiter } = require("firebase-functions-rate-limiter");
const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase);
const database = admin.database();

const limiter = FirebaseFunctionsRateLimiter.withRealtimeDbBackend(
  {
      name: "rate_limiter_collection",
      maxCalls: 2,
      periodSeconds: 60,
  },
  database,
);

exports.addContactFormSubmission = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    await limiter.rejectOnQuotaExceededOrRecordUsage(); 
    const data = req.body;
    await admin.firestore().collection('contact-form').doc(String((new Date()).getTime())).create(data);
    // save in Google Sheets file
    try {
      appendToSpreadSheet(functions.config().spreadsheet.spreadsheet_id, functions.config().spreadsheet.sheet_name, Object.values(data));
    } catch(e) {
      console.log(e);
    }
    res.json(null);
  });
});

function getJwtClient() {
  return new google.auth.JWT(
    functions.config().privatekey.client_email,
    null,
    functions.config().privatekey.private_key.replace(/\\n/g, "\n"),
    ['https://www.googleapis.com/auth/spreadsheets']);
}

function appendToSpreadSheet(spreadsheetId, sheetId, data) {
  const auth = getJwtClient();
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetId
  }, (err, res) => {
    if(err) return console.log(err);
    const length = res.data.values != null ? res.data.values.length : 0;
    sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetId}!A${length + 1}`,
      valueInputOption: 'RAW',
      resource: {
        values: [[...data, (new Date()).toUTCString()]]
      }
    });
  });
}