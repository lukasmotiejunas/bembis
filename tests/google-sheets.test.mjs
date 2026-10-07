import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../integrations/google-sheets/Code.gs", import.meta.url), "utf8");
const originalHeaders = ["Gauta", "Užsakymo nr.", "Būsena", "Vardas", "Telefonas", "El. paštas", "Adresas", "Miestas", "Prekės ir paslaugos", "Montavimas", "Pageidaujama montavimo data", "Nuėmimas po švenčių", "Pastabos", "Suma, €", "Stripe ID"];

function integration() {
  const rows = [[...originalHeaders]];
  const inquiries = [];
  const mail = [];
  let failMail = false;
  let configuredRecipients = '';
  let locked = false;
  let expectedMailLock = true;
  const sheetFor = (rows) => ({
    getLastRow: () => rows.length,
    getLastColumn: () => rows[0]?.length ?? 0,
    appendRow: (row) => rows.push([...row]),
    getRange: (row, col, height = 1, width = 1) => ({
      getValue: () => rows[row - 1]?.[col - 1] ?? "",
      setValue: (value) => { rows[row - 1][col - 1] = value; },
      getValues: () => rows.slice(row - 1, row - 1 + height).map((values) => values.slice(col - 1, col - 1 + width)),
      setValues: (values) => { for (let i = 0; i < values.length; i++) { rows[row - 1 + i] ||= []; for (let j = 0; j < values[i].length; j++) rows[row - 1 + i][col - 1 + j] = values[i][j]; } },
      createTextFinder: (query) => ({ matchEntireCell() { return this; }, findNext: () => {
        const index = rows.findIndex((values, i) => i >= row - 1 && i < row - 1 + height && String(values[col - 1]) === query);
        return index < 0 ? null : { getRow: () => index + 1 };
      } }),
    }),
  });
  const sheet = sheetFor(rows);
  const inquirySheet = sheetFor(inquiries);
  const context = vm.createContext({
    console: { error() {} },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key) => key === "ORDERS_WEBHOOK_SECRET" ? "test-secret" : key === "NOTIFICATION_EMAILS" ? configuredRecipients : null }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: (name) => name === 'Užklausos' ? inquirySheet : sheet }), flush() {} },
    LockService: { getScriptLock: () => ({ waitLock() { assert.equal(locked, false); locked = true; }, releaseLock() { locked = false; } }) },
    MailApp: { sendEmail(message) { assert.equal(locked, expectedMailLock); if (failMail) throw new Error("Quota exhausted"); mail.push(message); } },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (body) => ({ setMimeType: () => JSON.parse(body) }) },
  });
  vm.runInContext(source, context);
  const payload = { type: "order", secret: "test-secret", fields: { "Stripe ID": "cs_test_order", "Užsakymo nr.": "TEST", Vardas: "Klientas", "Suma, €": 78.96 },
    email: { to: ["office@example.invalid", "owner@example.invalid", "partner@example.invalid"], subject: "Test order", text: "Complete order details", html: "<p>Test</p>", replyTo: "customer@example.invalid" } };
  return { rows, inquiries, mail, payload, failMail(value) { failMail = value; }, configureRecipients(value) { configuredRecipients = value; }, expectMailLock(value) { expectedMailLock = value; },
    post(body = payload) { const result = context.doPost({ postData: { contents: JSON.stringify(body) } }); assert.equal(locked, false); return result; } };
}

test("Apps Script saves the order, emails all business recipients and skips a repeated payment", () => {
  const app = integration();
  const result = app.post();
  assert.equal(result.emailed, true);
  assert.equal(app.rows.length, 2);
  assert.equal(app.rows[0][15], "Pranešimas išsiųstas");
  assert.equal(app.rows[1][15], "Taip");
  assert.equal(app.mail.length, 1);
  assert.equal(app.mail[0].to, "office@example.invalid,owner@example.invalid,partner@example.invalid");
  assert.equal(app.mail[0].replyTo, "customer@example.invalid");
  assert.equal(app.post().duplicate, true);
  assert.equal(app.mail.length, 1);
  assert.equal(app.rows.length, 2);
});

test("A failed order email keeps its row and a Stripe retry sends only the missing notification", () => {
  const app = integration();
  app.failMail(true);
  const failed = app.post();
  assert.equal(failed.ok, false);
  assert.equal(failed.recorded, true);
  assert.equal(failed.emailed, false);
  assert.equal(app.rows.length, 2);
  assert.equal(app.rows[1][15], "");
  app.failMail(false);
  assert.equal(app.post().emailed, true);
  assert.equal(app.mail.length, 1);
  assert.equal(app.rows.length, 2);
  app.post();
  assert.equal(app.mail.length, 1);
});

test("Existing paid orders can be notified without overwriting their fields", () => {
  const app = integration();
  app.rows.push(originalHeaders.map((header) => header === "Stripe ID" ? "cs_test_order" : header === "Būsena" ? "Išsiųsta" : "Existing value"));
  assert.equal(app.post().emailed, true);
  assert.equal(app.rows.length, 2);
  assert.equal(app.rows[1][2], "Išsiųsta");
  assert.equal(app.rows[1][15], "Taip");
});

test("Unauthorized requests and missing mail data cannot record or notify an order", () => {
  const app = integration();
  assert.equal(app.post({ ...app.payload, secret: "wrong" }).ok, false);
  assert.equal(app.post({ ...app.payload, email: undefined }).ok, false);
  assert.equal(app.post({ ...app.payload, email: { ...app.payload.email, to: ["invalid"] } }).ok, false);
  assert.equal(app.rows.length, 1);
  assert.equal(app.mail.length, 0);
});

test("The currently published website can notify orders using shared Apps Script recipients", () => {
  const app = integration();
  app.configureRecipients('office@example.invalid, owner@example.invalid, partner@example.invalid');
  const fields = { ...app.payload.fields, Vardas: '<script>bad</script>', 'El. paštas': 'customer@example.invalid', 'Prekės ir paslaugos': 'XP motininė × 1\nXP papildoma × 3' };
  assert.equal(app.post({ ...app.payload, fields, email: undefined }).emailed, true);
  assert.equal(app.mail[0].to, 'office@example.invalid,owner@example.invalid,partner@example.invalid');
  assert.match(app.mail[0].body, /Suma, €: 78,96 €/);
  assert.match(app.mail[0].htmlBody, /&lt;script&gt;/);
  assert.ok(!app.mail[0].htmlBody.includes('<script>'));
  assert.equal(app.mail[0].replyTo, 'customer@example.invalid');
});

test("Configured recipients also override an older recipient list sent by the website", () => {
  const app = integration();
  app.configureRecipients('owner@example.invalid,partner@example.invalid');
  assert.equal(app.post().emailed, true);
  assert.equal(app.mail[0].to, 'owner@example.invalid,partner@example.invalid');
});

test("Inquiry notifications use the same configured recipients and retain their sheet and reply-to", () => {
  const app = integration();
  app.configureRecipients('office@example.invalid,owner@example.invalid,partner@example.invalid');
  app.expectMailLock(false);
  const payload = { ...app.payload, type: 'inquiry', fields: { Gauta: '2026-10-07', Vardas: 'Klientas', Telefonas: '+37060000000', 'El. paštas': 'customer@example.invalid', Žinutė: 'Test inquiry' } };
  assert.equal(app.post(payload).emailed, true);
  assert.equal(app.rows.length, 1);
  assert.equal(app.inquiries.length, 2);
  assert.equal(app.mail[0].to, 'office@example.invalid,owner@example.invalid,partner@example.invalid');
  assert.equal(app.mail[0].replyTo, 'customer@example.invalid');
});
