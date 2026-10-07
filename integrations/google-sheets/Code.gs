/** Kalėdų Dekoras: apmokėti užsakymai ir kontaktų užklausos. */
const ORDERS_SHEET_ID = '1z86yWePxJUv8GTkpctyzTNbnuZeZd9wY63uzh-OqCOo';
const ORDERS_SHEET_NAME = 'Užsakymai';
const ORDER_EMAIL_HEADER = 'Pranešimas išsiųstas';
const ORDERS_HEADERS = ['Gauta', 'Užsakymo nr.', 'Būsena', 'Vardas', 'Telefonas', 'El. paštas', 'Adresas', 'Miestas', 'Prekės ir paslaugos', 'Montavimas', 'Pageidaujama montavimo data', 'Nuėmimas po švenčių', 'Pastabos', 'Suma, €', 'Stripe ID', ORDER_EMAIL_HEADER];

const INQUIRIES_SHEET_NAME = 'Užklausos';
const INQUIRIES_HEADERS = ['Gauta', 'Vardas', 'Telefonas', 'El. paštas', 'Adresas', 'Domina', 'Žinutė', 'Puslapis'];
const SENDER_NAME = 'Kalėdų Dekoras svetainė';

// Run once from the editor, after reviewing Google's requested permissions.
function setupIntegration() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ORDERS_WEBHOOK_SECRET')) {
    props.setProperty('ORDERS_WEBHOOK_SECRET', (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''));
  }
  const sheet = getOrdersSheet_();
  ensureHeaders_(sheet);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);
  sheet.setHiddenGridlines(true);
  const header = sheet.getRange(1, 1, 1, ORDERS_HEADERS.length);
  header.setFontWeight('bold').setFontColor('#ffffff').setBackground('#234638');
  header.setWrap(true).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 44);
  const widths = [160, 145, 120, 175, 145, 230, 245, 175, 340, 120, 180, 180, 330, 110, 370, 190];
  widths.forEach(function(width, i) { sheet.setColumnWidth(i + 1, width); });
  const last = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, 1, last, 13).setNumberFormat('@');
  sheet.getRange(2, 15, last, 1).setNumberFormat('@');
  sheet.getRange(2, 14, last, 1).setNumberFormat('#,##0.00" €"');
  sheet.getRange(2, 3, last, 1).setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['Naujas', 'Suderinta', 'Išsiųsta', 'Sumontuota', 'Užbaigta', 'Atšaukta'], true)
    .setAllowInvalid(false).build());
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); }
  catch (err) { return reply_({ok:false, error:'bad json'}); }
  const secret = PropertiesService.getScriptProperties().getProperty('ORDERS_WEBHOOK_SECRET');
  if (!secret || !body || body.secret !== secret) return reply_({ok:false, error:'unauthorized'});
  if (body.type === 'inquiry') return handleInquiry_(body);
  if (body.type !== 'order') return reply_({ok:false, error:'unknown type'});
  const fields = body.fields;
  if (!fields || typeof fields !== 'object' || !fields['Stripe ID']) return reply_({ok:false, error:'missing order'});
  const email = emailWithRecipients_(body.email || buildOrderEmail_(fields));
  if (!validEmailPayload_(email)) return reply_({ok:false, error:'missing email'});
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  let recorded = false;
  try {
    const sheet = getOrdersSheet_();
    const headers = ensureHeaders_(sheet);
    const idCol = headers.indexOf('Stripe ID') + 1;
    const emailCol = headers.indexOf(ORDER_EMAIL_HEADER) + 1;
    let row = 0;
    if (sheet.getLastRow() > 1) {
      const existing = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1)
        .createTextFinder(String(fields['Stripe ID'])).matchEntireCell(true).findNext();
      if (existing) row = existing.getRow();
    }
    const duplicate = row > 0;
    if (!row) {
      // The caller cannot mark its own notification as sent.
      sheet.appendRow(headers.map(function(h) { return h === ORDER_EMAIL_HEADER ? '' : clean_(fields[h]); }));
      row = sheet.getLastRow();
    }
    recorded = true;
    if (sheet.getRange(row, emailCol).getValue() === 'Taip') {
      return reply_({ok:true, recorded:true, emailed:true, duplicate:true});
    }
    // Keep the lock until mail and its status are saved, so concurrent Stripe
    // retries cannot send two notifications. An unsent existing row is retried.
    sendNotification_(email);
    sheet.getRange(row, emailCol).setValue('Taip');
    SpreadsheetApp.flush();
    return reply_({ok:true, recorded:true, emailed:true, duplicate:duplicate});
  } catch (err) {
    console.error('Order could not be recorded or notified: ' + err.message);
    return reply_({ok:false, recorded:recorded, emailed:false, error:'could not record or notify order'});
  } finally { lock.releaseLock(); }
}

function getOrdersSheet_() {
  const ss = SpreadsheetApp.openById(ORDERS_SHEET_ID);
  return ss.getSheetByName(ORDERS_SHEET_NAME) || ss.insertSheet(ORDERS_SHEET_NAME);
}

function ensureHeaders_(sheet) {
  let headers = sheet.getLastRow() === 0 ? [] : sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const missing = ORDERS_HEADERS.filter(function(h) { return headers.indexOf(h) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
  }
  return headers;
}

function clean_(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string' && /^[=+\-@]/.test(value)) return "'" + value;
  return value;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Creates the inquiry sheet and requests only the mail-sending permission. */
function setupInquiries() {
  const sheet = getInquiriesSheet_();
  ensureInquiryHeaders_(sheet);
  sheet.setFrozenRows(1);
  sheet.setHiddenGridlines(true);
  sheet.getRange(1, 1, 1, INQUIRIES_HEADERS.length)
    .setFontWeight('bold').setFontColor('#ffffff').setBackground('#234638').setWrap(true);
  sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), INQUIRIES_HEADERS.length).setNumberFormat('@');
  [160, 175, 145, 230, 245, 300, 420, 340].forEach(function(width, i) { sheet.setColumnWidth(i + 1, width); });
  console.log('Inquiry sheet ready. Remaining email recipient quota: ' + MailApp.getRemainingDailyQuota());
}

function handleInquiry_(body) {
  const fields = body.fields;
  const email = emailWithRecipients_(body.email || {});
  if (!fields || typeof fields !== 'object' || !fields.Vardas || !fields.Telefonas) {
    return reply_({ok:false, error:'missing inquiry'});
  }
  if (!validEmailPayload_(email)) {
    return reply_({ok:false, error:'missing email'});
  }

  // Save first, so the inquiry remains available even if email delivery fails.
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getInquiriesSheet_();
    const headers = ensureInquiryHeaders_(sheet);
    sheet.appendRow(headers.map(function(h) { return clean_(fields[h]); }));
  } catch (err) {
    console.error('Inquiry could not be recorded: ' + err.message);
    return reply_({ok:false, error:'could not record inquiry'});
  } finally { lock.releaseLock(); }

  try {
    sendNotification_(email);
    return reply_({ok:true, recorded:true, emailed:true});
  } catch (err) {
    console.error('Inquiry email could not be sent: ' + err.message);
    return reply_({ok:false, recorded:true, emailed:false, error:'could not send inquiry email'});
  }
}

/** Script Property can update both notification routes without a website deployment. */
function emailWithRecipients_(email) {
  const configured = PropertiesService.getScriptProperties().getProperty('NOTIFICATION_EMAILS');
  const recipients = configured ? configured.split(',').map(function(value) { return value.trim(); }).filter(isEmail_) : [];
  return Object.assign({}, email, recipients.length ? {to:recipients} : {});
}

/** Backward-compatible notification for the website's existing order payload. */
function buildOrderEmail_(fields) {
  const rows = ORDERS_HEADERS.filter(function(header) { return header !== ORDER_EMAIL_HEADER; })
    .map(function(header) {
      const value = fields[header];
      return [header, header === 'Suma, €' ? Number(value || 0).toFixed(2).replace('.', ',') + ' €' : String(value === undefined || value === null || value === '' ? '—' : value)];
    });
  return {
    subject: 'Naujas apmokėtas užsakymas — ' + String(fields['Užsakymo nr.'] || fields['Stripe ID']),
    text: 'Naujas apmokėtas užsakymas iš svetainės\n\n' + rows.map(function(row) { return row[0] + ': ' + row[1]; }).join('\n'),
    html: '<div style="font-family:Arial,Helvetica,sans-serif;color:#16231c;max-width:640px"><h2 style="color:#122a1f">Naujas apmokėtas užsakymas</h2><table style="border-collapse:collapse;width:100%">' + rows.map(function(row) {
      return '<tr><td style="padding:10px 12px;border-bottom:1px solid #e7dfd1;vertical-align:top;color:#59665f">' + escapeHtml_(row[0]) + '</td><td style="padding:10px 12px;border-bottom:1px solid #e7dfd1;white-space:pre-wrap">' + escapeHtml_(row[1]) + '</td></tr>';
    }).join('') + '</table><p>Apmokėjimas patvirtintas.</p></div>',
    replyTo: fields['El. paštas'],
  };
}

function escapeHtml_(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function validEmailPayload_(email) {
  return Array.isArray(email.to) && email.to.some(isEmail_) &&
    typeof email.subject === 'string' && !!email.subject &&
    typeof email.text === 'string' && !!email.text;
}

function sendNotification_(email) {
  const message = {
    to: email.to.filter(isEmail_).join(','),
    subject: email.subject,
    body: email.text,
    name: SENDER_NAME,
  };
  if (email.html) message.htmlBody = String(email.html);
  if (isEmail_(email.replyTo)) message.replyTo = email.replyTo;
  MailApp.sendEmail(message);
}

function getInquiriesSheet_() {
  const ss = SpreadsheetApp.openById(ORDERS_SHEET_ID);
  return ss.getSheetByName(INQUIRIES_SHEET_NAME) || ss.insertSheet(INQUIRIES_SHEET_NAME);
}

function ensureInquiryHeaders_(sheet) {
  let headers = sheet.getLastRow() === 0 ? [] : sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const missing = INQUIRIES_HEADERS.filter(function(h) { return headers.indexOf(h) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
  }
  return headers;
}

function isEmail_(value) {
  return typeof value === 'string' && /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/.test(value);
}
