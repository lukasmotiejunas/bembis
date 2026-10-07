import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";

const source = fs.readFileSync(new URL("../lib/analytics.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const context = { exports: {}, URL };
vm.runInNewContext(outputText, context);
const { analyticsUrl, CONSENT_MAX_AGE, createPageViewTracker, isMeasurementId, readConsent } = context.exports;

test("analytics consent requires an explicit, recent choice", () => {
  const now = Date.now();
  const preference = (choice, savedAt = now) => JSON.stringify({ choice, savedAt });
  assert.equal(readConsent(null, now), null);
  assert.equal(readConsent("invalid", now), null);
  assert.equal(readConsent(preference("unknown"), now), null);
  assert.equal(readConsent(preference("granted"), now), "granted");
  assert.equal(readConsent(preference("denied"), now), "denied");
  assert.equal(readConsent(preference("granted", now - CONSENT_MAX_AGE), now), null);
  assert.equal(readConsent(preference("granted", now + 1000), now), null);
});

test("Analytics URLs omit contact details, checkout IDs, fragments and credentials", () => {
  assert.equal(analyticsUrl("https://www.kaledudekoras.lt/checkout/success?session_id=cs_private#email=customer@example.com"), "https://www.kaledudekoras.lt/checkout/success");
  assert.equal(analyticsUrl("https://user:password@example.com/page?phone=123"), "https://example.com/page");
  assert.equal(analyticsUrl("javascript:alert(1)"), "");
  assert.equal(analyticsUrl("not a URL"), "");
});

test("each navigation counts once, back navigation counts, URL parameter changes do not", () => {
  const calls = [];
  const track = createPageViewTracker((...args) => calls.push(args), "G-TEST123456", "https://example.com/?email=private");
  track("https://www.kaledudekoras.lt/", "Pradžia");
  track("https://www.kaledudekoras.lt/", "Pradžia");
  track("https://www.kaledudekoras.lt/montavimas?session_id=private", "Montavimas");
  track("https://www.kaledudekoras.lt/montavimas#kainos", "Montavimas");
  track("https://www.kaledudekoras.lt/", "Pradžia");
  const events = calls.filter(([command]) => command === "event");
  assert.equal(events.length, 3);
  assert.equal(events[0][2].page_referrer, "https://example.com/");
  assert.equal(events[1][2].page_referrer, "https://www.kaledudekoras.lt/");
  assert.equal(events[2][2].page_referrer, "https://www.kaledudekoras.lt/montavimas");
  assert.equal(events[1][2].page_title, "Montavimas");
  assert.equal(events[1][2].send_to, "G-TEST123456");
  assert.equal(JSON.stringify(calls).includes("private"), false);
});

test("measurement IDs accept GA4 IDs only", () => {
  assert.equal(isMeasurementId("G-TEST123456"), true);
  assert.equal(isMeasurementId(""), false);
  assert.equal(isMeasurementId("UA-123456"), false);
  assert.equal(isMeasurementId('G-TEST"</script>'), false);
});
