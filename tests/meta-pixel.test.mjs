import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";

function load(window) {
  const analyticsContext = { exports: {}, URL };
  const compile = file => ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(compile("../lib/analytics.ts"), analyticsContext);
  const context = { exports: {}, URL, Event, window, process: { env: { NEXT_PUBLIC_META_PIXEL_ID: "1234567890123456" } }, require: () => analyticsContext.exports };
  vm.runInNewContext(compile("../lib/meta-pixel.ts"), context);
  return context.exports;
}

function browser() {
  const values = new Map();
  return { location: { href: "https://www.kaledudekoras.lt/kontaktai#forma" }, localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }, dispatchEvent() {}, addEventListener() {}, removeEventListener() {} };
}

test("Meta consent is separate from an existing analytics grant; no SDK or events before opt-in", () => {
  const win = browser();
  win.localStorage.setItem("kaledudekoras.analytics-consent.v1", JSON.stringify({ choice: "granted", savedAt: Date.now() }));
  const meta = load(win);
  assert.equal(meta.marketingConsentSnapshot(), null);
  assert.equal(meta.trackMetaEvent("Lead"), false);
  assert.equal(win.fbq, undefined);
  meta.saveMarketingConsent("granted");
  meta.prepareMetaPixel("1234567890123456");
  assert.equal(meta.trackMetaEvent("Lead"), true);
  assert.equal(win.fbq.queue.filter(call => call[0] === "trackSingle").length, 1);
  assert.deepEqual(Array.from(win.fbq.queue.find(call => call[0] === "init")), ["init", "1234567890123456"]);
  assert.equal(win.fbq.disablePushState, true);
  meta.saveMarketingConsent("denied");
  assert.equal(meta.trackMetaEvent("Lead"), false);
});

test("private URLs, checkout session IDs and form-prefill query data are never tracked", () => {
  const win = browser();
  const meta = load(win);
  meta.saveMarketingConsent("granted");
  meta.prepareMetaPixel("1234567890123456");
  const blocked = ["/checkout/success?session_id=cs_private", "/admin", "/api/stripe/webhook", "/kontaktai?message=private", "/kontaktai#email=private"];
  for (const path of blocked) {
    win.location.href = `https://www.kaledudekoras.lt${path}`;
    assert.equal(meta.trackMetaEvent("PageView"), false, path);
  }
  win.location.href = "http://localhost:3000/";
  assert.equal(meta.trackMetaEvent("PageView"), false);
  win.location.href = "https://www.kaledudekoras.lt/?utm_source=facebook&fbclid=ad_click";
  assert.equal(meta.trackMetaEvent("PageView"), true);
  assert.equal(JSON.stringify(win.fbq.queue).includes("private"), false);
});

test("tracking cannot break commerce when storage or the SDK fails", () => {
  const win = browser();
  win.localStorage.getItem = () => { throw new Error("blocked storage"); };
  win.localStorage.setItem = () => { throw new Error("blocked storage"); };
  const meta = load(win);
  meta.saveMarketingConsent("granted");
  meta.prepareMetaPixel("1234567890123456");
  assert.equal(meta.marketingConsentSnapshot(), "granted");
  win.fbq = () => { throw new Error("blocked SDK"); };
  assert.equal(meta.trackMetaEvent("AddToCart", { value: 10, currency: "EUR" }), false);
});
