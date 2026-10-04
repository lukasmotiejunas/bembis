/**
 * Kalėdų Dekoras — apmokėtų užsakymų įrašymas į Google Sheets.
 *
 * Svetainė siunčia užsakymą čia tik tada, kai Stripe patvirtina apmokėjimą.
 * Diegimo instrukcija: integrations/google-sheets/README.md
 */

// Tas pats slaptažodis turi būti įrašytas Vercel nustatymuose kaip GOOGLE_SHEETS_SECRET.
const SECRET = 'PAKEISKITE-I-ILGA-ATSITIKTINI-SLAPTAZODI';

const SHEET_NAME = 'Užsakymai';
const ID_COLUMN = 'Stripe ID';

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply_({ ok: false, error: 'bad json' });
  }
  if (!body || body.secret !== SECRET) return reply_({ ok: false, error: 'unauthorized' });

  const fields = body.fields || {};
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getSheet_();
    const headers = ensureHeaders_(sheet, Object.keys(fields));

    // Stripe may deliver the same payment more than once — write each order only once.
    const idCol = headers.indexOf(ID_COLUMN) + 1;
    if (idCol > 0 && sheet.getLastRow() > 1 && fields[ID_COLUMN]) {
      const existing = sheet
        .getRange(2, idCol, sheet.getLastRow() - 1, 1)
        .createTextFinder(String(fields[ID_COLUMN]))
        .matchEntireCell(true)
        .findNext();
      if (existing) return reply_({ ok: true, duplicate: true });
    }

    sheet.appendRow(headers.map(function (h) { return clean_(fields[h]); }));
    return reply_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

/** Creates the header row on first use and adds any new columns at the end. */
function ensureHeaders_(sheet, keys) {
  let headers = sheet.getLastRow() === 0 ? [] : sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const missing = keys.filter(function (k) { return headers.indexOf(k) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight('bold');
    headers = headers.concat(missing);
    sheet.setFrozenRows(1);
  }
  return headers;
}

/** Keeps customer text as plain text: no formulas, and "+370..." stays a phone number. */
function clean_(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string' && /^[=+\-@]/.test(value)) return "'" + value;
  return value;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
