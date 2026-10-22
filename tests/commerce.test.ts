import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { products, getProduct, productHref } from "../lib/data/products";
import { pricing } from "../lib/data/pricing";
import { buildEstimate, EstimateChoice } from "../lib/data/priceExample";
import { buildOrder } from "../lib/orders/order";
import { buildSessionParams, validateCheckout } from "../lib/orders/checkout";
import { prepareOrderInquiry } from "../lib/orders/inquiry";
import { formatPrice } from "../lib/format";
import { cartTotals, resolveLines } from "../lib/store/cartStore";
import { productSchema } from "../lib/seo";
import { validateInquiry } from "../lib/inquiry";
import { buildLightSet, lightSetItems } from "../lib/data/lightSet";
import { plural } from "../lib/format";
import { notificationRecipients } from "../lib/notifications";
import { buildOrderEmail } from "../lib/orders/email";
import { appendOrderToSheet, sheetFieldsFromSession } from "../lib/orders/sheet";
import type Stripe from "stripe";
import { stripeConfigurationError, stripePaymentMode } from "../lib/stripe-config";
import {
  adminPassword,
  createSessionToken,
  passwordMatches,
  SESSION_DAYS,
  verifySessionToken,
} from "../lib/admin";
import { isSiteTheme } from "../lib/theme";
import { createDiscountCode, discountsEnabled, spinWheelPrize, verifyDiscountCode } from "../lib/discount";
import { wheelPrizes, wheelSlices } from "../lib/data/wheel";
import {
  describeParcelMachine,
  parseParcelMachines,
  searchParcelMachines,
} from "../lib/data/delivery";

test("Užklausos ir užsakymai naudoja bendrą, be pasikartojimų gavėjų sąrašą", () => {
  const previous = process.env.INQUIRY_EMAILS;
  try {
    process.env.INQUIRY_EMAILS = " office@example.invalid, owner@example.invalid, partner@example.invalid, owner@example.invalid ";
    assert.deepEqual(notificationRecipients(), ["office@example.invalid", "owner@example.invalid", "partner@example.invalid"]);
    process.env.INQUIRY_EMAILS = " , ";
    assert.deepEqual(notificationRecipients(), ["info@kaledudekoras.lt"]);
  } finally {
    if (previous === undefined) delete process.env.INQUIRY_EMAILS;
    else process.env.INQUIRY_EMAILS = previous;
  }
});

test("Production rejects sandbox keys; live payments require an explicit matching key and webhook", () => {
  assert.equal(stripePaymentMode({ STRIPE_SECRET_KEY: "rk_live_example" }), "live");
  assert.equal(stripePaymentMode({ STRIPE_SECRET_KEY: "pk_live_example" }), null);
  assert.ok(stripeConfigurationError({ STRIPE_SECRET_KEY: "sk_test_example", VERCEL_ENV: "production" }));
  assert.ok(stripeConfigurationError({ STRIPE_SECRET_KEY: "sk_test_example", STRIPE_PAYMENT_MODE: "live" }));
  assert.ok(stripeConfigurationError({ STRIPE_SECRET_KEY: "sk_live_example", STRIPE_PAYMENT_MODE: "live" }));
  assert.equal(stripeConfigurationError({ STRIPE_SECRET_KEY: "sk_live_example", STRIPE_WEBHOOK_SECRET: "whsec_example", STRIPE_PAYMENT_MODE: "live", VERCEL_ENV: "production" }), null);
  assert.equal(stripeConfigurationError({ STRIPE_SECRET_KEY: "sk_test_example", STRIPE_PAYMENT_MODE: "test" }), null);
});

test("Historical payment checks remain labelled without physical delivery in order notifications", () => {
  const fields = sheetFieldsFromSession({
    id: "cs_live_check", created: 1791357300, amount_total: 100,
    metadata: { payment_test: "yes", order_number: "TEST-KD-1", name: "Payment check",
      email: "check@example.invalid", delivery: "none", items_0: "Mokėjimo patikra — 1,00 €",
      notes: "Mokėjimo patikra. Prekių nepristatyti." },
  } as unknown as Stripe.Checkout.Session);
  assert.equal(fields.Būsena, "Mokėjimo patikra");
  assert.equal(fields.Pristatymas, "Netaikoma — mokėjimo patikra");
  assert.equal(fields["Suma, €"], 1);
  assert.match(String(fields.Pastabos), /Prekių nepristatyti/);
  assert.match(buildOrderEmail(fields).text, /Mokėjimo patikra/);
});

test("Apmokėto užsakymo laiške pateikiami visi lentelės duomenys ir saugus HTML", () => {
  const fields = sheetFieldsFromSession({
    id: "cs_test_notification", created: 1791357300, amount_total: 7896,
    metadata: { order_number: "TEST-ORDER", name: "<script>alert(1)</script>",
      email: "customer@example.invalid", phone: "+37060000000", address: "Testo gatvė 1", city: "Vilnius",
      items: "XP motininė × 1\nXP papildoma × 3", installation: "no", removal: "no", notes: "<b>Pastaba</b>" },
  } as unknown as Stripe.Checkout.Session);
  const email = buildOrderEmail(fields);
  assert.equal(email.subject, "Naujas apmokėtas užsakymas — TEST-ORDER");
  assert.equal(email.replyTo, "customer@example.invalid");
  for (const [label, value] of Object.entries(fields)) {
    assert.ok(email.text.includes(`${label}: ${label === "Suma, €" ? formatPrice(Number(value)) : String(value || "—")}`));
  }
  assert.match(email.html, /&lt;script&gt;/);
  assert.ok(!email.html.includes("<script>"));
  assert.match(email.text, /78,96/);
});

test("Užsakymo perdavimas reikalauja laiško patvirtinimo ir perduoda verslo gavėjus", async () => {
  const originalFetch = global.fetch;
  const originalEnv = { url: process.env.GOOGLE_SHEETS_WEBHOOK_URL, secret: process.env.GOOGLE_SHEETS_SECRET, to: process.env.INQUIRY_EMAILS };
  let result: Record<string, unknown> = { ok: true, recorded: true, emailed: true };
  let sent: Record<string, unknown> = {};
  try {
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://example.invalid/webhook";
    process.env.GOOGLE_SHEETS_SECRET = "test-only";
    process.env.INQUIRY_EMAILS = "owner@example.invalid,partner@example.invalid";
    global.fetch = async (_url, options) => {
      sent = JSON.parse(String(options?.body));
      return Response.json(result);
    };
    const fields = { "Stripe ID": "cs_test", "Užsakymo nr.": "TEST", "Suma, €": 78.96, "El. paštas": "customer@example.invalid" };
    await appendOrderToSheet(fields);
    assert.equal(sent.type, "order");
    assert.deepEqual(sent.fields, fields);
    assert.deepEqual((sent.email as { to: string[] }).to, ["owner@example.invalid", "partner@example.invalid"]);
    result = { ok: true };
    await assert.rejects(appendOrderToSheet(fields), /notification was not confirmed/);
    result = { ok: false, recorded: true, emailed: false };
    await assert.rejects(appendOrderToSheet(fields), /Google Sheets responded/);
  } finally {
    global.fetch = originalFetch;
    for (const [key, value] of [["GOOGLE_SHEETS_WEBHOOK_URL", originalEnv.url], ["GOOGLE_SHEETS_SECRET", originalEnv.secret], ["INQUIRY_EMAILS", originalEnv.to]]) {
      if (value === undefined) delete process.env[key!];
      else process.env[key!] = value;
    }
  }
});

const expected = [
  ["61030", 7.5, 38.99],
  ["61040", 7.5, 31.99],
  ["63100", 7.5, 24.99],
  ["63110", 7.5, 17.99],
  ["llinks-45", 45, 168.99],
  ["llinks-60", 60, 209.99],
  ["xp-45", 45, 97.99],
  ["xp-60", 60, 120.99],
] as const;
/** Price on the site: the approved list price plus 10 %, rounded to the cent (computed independently). */
const raised = (price: number) => Math.round(Math.round(price * 100) * 1.1) / 100;
const customer = {
  name: "Patikros klientas",
  phone: "+37060000000",
  email: "test@example.invalid",
  address: "Testo gatvė 1",
  city: "Vilnius",
  installDate: "",
  notes: "",
};
const services = { installation: false, removal: false };
const input = {
  items: [{ productId: "61030", mode: "buy" as const, quantity: 2 }],
  services,
  customer,
  delivery: { method: "courier" as const, parcelMachineId: "" },
};
const machine = {
  id: "12345",
  name: "Vilniaus Akropolio paštomatas",
  address: "Ozo g. 25, Vilniaus m.",
  note: "",
};

test("Visos pardavimo kainos ir vienetai sutampa su nepriklausomu šaltinio sąrašu", () => {
  assert.equal(products.filter((p) => p.kind !== "decoration").length, 8);
  assert.equal(new Set(products.map(productHref)).size, products.length);
  for (const [id, meters, price] of expected) {
    const p = getProduct(id, "buy")!;
    assert.equal(p.meters, meters);
    assert.equal(p.price, raised(price));
    assert.equal(p.sections * 7.5, meters);
    const schema = productSchema(p);
    assert.equal(schema.offers.price, raised(price).toFixed(2));
    assert.equal(schema.offers.availability, "https://schema.org/InStock");
    assert.equal(p.deliveryBusinessDays, 2);
    assert.equal(schema.offers.priceCurrency, "EUR");
    assert.equal(schema.offers.hasMerchantReturnPolicy.merchantReturnDays, 14);
    assert.equal(
      schema.offers.hasMerchantReturnPolicy.returnFees,
      "https://schema.org/ReturnFeesCustomerResponsibility",
    );
    assert.deepEqual(
      schema.offers.shippingDetails.map((d) => d.shippingRate.value),
      [2.29, 4.99],
    );
    for (const d of schema.offers.shippingDetails)
      assert.equal(d.shippingDestination.addressCountry, "LT");
    assert.equal(getProduct(id, "rent"), undefined);
    for (const photo of p.photos ?? []) assert.ok(existsSync(join(process.cwd(), "public", photo)), photo);
  }
});
test("Stripe sesijoje išsaugomi prekių kodai ir kiekiai", () => {
  const items = [...input.items, { productId: "63110", mode: "buy" as const, quantity: 3 }];
  const order = buildOrder(items, input.services, { method: "courier" });
  const session = buildSessionParams({ ...input, items }, order, "https://www.kaledudekoras.lt", "KD-TEST-IDS");
  assert.equal(session.metadata?.product_ids_0, "61030:2,63110:3");
  assert.equal(session.line_items?.[1].price_data?.product_data?.metadata?.product_id, "63110");
  assert.equal(session.line_items?.[1].price_data?.unit_amount, Math.round(raised(17.99) * 100));
});
test("Komplektų kainų formulės perskaičiuotos nepriklausomai", () => {
  assert.equal(Math.round((38.99 + 31.99 * 5) * 0.85) - 0.01, 168.99);
  assert.equal(Math.round((38.99 + 31.99 * 7) * 0.8) - 0.01, 209.99);
  assert.equal(Math.round((24.99 + 17.99 * 5) * 0.85) - 0.01, 97.99);
  assert.equal(Math.round((24.99 + 17.99 * 7) * 0.8) - 0.01, 120.99);
});
test("12 × 12 yra 48 m perimetras; vienas darbo tarifas jau apima nuėmimą", () => {
  const ll = buildEstimate("llinks")!;
  assert.equal(ll.perimeter, 48);
  assert.equal(ll.meters, 48);
  assert.equal(ll.rentalTotal, 239.52);
  assert.equal(ll.workTotal, 191.52);
  assert.equal(ll.total, 431.04);
  assert.equal(buildEstimate("xp")!.total, 359.04);
  const sheetExample = buildEstimate()!;
  assert.equal(sheetExample.choice, "xp");
  assert.equal(sheetExample.rentalTotal, 167.52);
  assert.equal(sheetExample.workTotal, 191.52);
  assert.equal(sheetExample.total, 359.04);
  const own = buildEstimate("client")!;
  assert.equal(own.rentalTotal, 0);
  assert.equal(own.workTotal, 287.52);
  assert.equal(own.total, 287.52);
  const extra = buildEstimate("xp", 12, 12, 1)!;
  assert.equal(extra.meters, 49);
  assert.equal(extra.rentalTotal, 171.01);
  assert.equal(extra.workTotal, 195.51);
  assert.equal(extra.total, 366.52);
});
test("Sąmatos ribinės reikšmės ir centų apvalinimas", () => {
  for (const [width, length, extra] of [
    [0, 12, 0],
    [-1, 12, 0],
    [NaN, 12, 0],
    [12, Infinity, 0],
    [12, 12, -1],
    [12, 12, NaN],
    [1e308, 1e308, 0],
  ])
    assert.equal(buildEstimate("xp", width, length, extra), null);
  assert.equal(buildEstimate("other" as EstimateChoice), null);
  const small = buildEstimate("xp", 0.1, 0.1)!;
  assert.equal(small.perimeter, 0.4);
  assert.equal(small.rentalTotal, 1.4);
  assert.equal(small.workTotal, 1.6);
  assert.equal(small.total, 3);
  assert.equal(formatPrice(38.99), "38,99\u00a0€");
});
test("Krepšelis ir serveris vienodai skaičiuoja visus vienetus centais", () => {
  const items = expected.map(([id], i) => ({
    productId: id,
    mode: "buy" as const,
    quantity: i + 1,
  }));
  const independentCents = expected.reduce(
    (s, [, , price], i) => s + Math.round(raised(price) * 100) * (i + 1),
    0,
  );
  const order = buildOrder(items, services);
  assert.equal(order.productsTotal, independentCents / 100);
  assert.equal(cartTotals(resolveLines(items)).total, order.productsTotal);
  assert.equal(
    order.meters,
    expected.reduce((s, [, meters], i) => s + meters * (i + 1), 0),
  );
  const repeated = buildOrder(
    [{ productId: "63110", mode: "buy", quantity: 99 }],
    services,
  );
  assert.equal(repeated.productsTotal, 1959.21); // 99 × 19,79
});
test("Serveris nepasitiki naršyklės kaina ir atmeta netinkamas prekes, nuomos režimą bei kiekius", () => {
  const forged = {
    ...input,
    price: 0,
    total: 0,
    items: [{ ...input.items[0], price: 0, unitPrice: 0 }],
  };
  const parsed = validateCheckout(forged);
  assert.equal(parsed.ok, true);
  if (parsed.ok)
    assert.equal(
      buildOrder(parsed.value.items, parsed.value.services).productsTotal,
      85.78,
    );
  for (const item of [
    { productId: "1", mode: "buy", quantity: 1 },
    { productId: "61030", mode: "rent", quantity: 1 },
    ...[0, -1, 1.5, 100, NaN, Infinity].map((quantity) => ({
      productId: "61030",
      mode: "buy",
      quantity,
    })),
  ])
    assert.equal(validateCheckout({ ...input, items: [item] }).ok, false);
  assert.equal(validateCheckout({ ...input, items: [] }).ok, false);
});
test("Pristatymas: paštomatas 2,29 €, kurjeris 4,99 €, montuojant lemputes atvežame nemokamai", () => {
  assert.deepEqual(pricing.delivery, { parcel: 2.29, courier: 4.99 });
  const none = buildOrder(input.items, services);
  assert.equal(none.deliveryMissing, true);
  assert.equal(none.total, 85.78); // 2 × 42,89
  assert.equal(none.extras.length, 0);
  assert.throws(() =>
    buildSessionParams(input, none, "https://www.kaledudekoras.lt", "TEST"),
  );
  const courier = buildOrder(input.items, services, { method: "courier" });
  assert.equal(courier.deliveryMissing, false);
  assert.equal(courier.extras[0].name, "Pristatymas kurjeriu");
  assert.equal(courier.total, 90.77);
  const noMachine = buildOrder(input.items, services, { method: "parcel" });
  assert.equal(noMachine.deliveryMissing, true);
  const parcel = buildOrder(input.items, services, {
    method: "parcel",
    parcelMachine: machine,
  });
  assert.equal(parcel.deliveryMissing, false);
  assert.equal(parcel.extras[0].name, "Pristatymas į Omniva paštomatą");
  assert.equal(parcel.extras[0].detail, "Vilniaus Akropolio paštomatas, Ozo g. 25, Vilniaus m.");
  assert.equal(parcel.total, 88.07);
  assert.equal(parcel.productsTotal, 85.78);
  for (const selection of [
    { installation: true, removal: true },
    { installation: false, removal: true },
  ]) {
    const order = buildOrder(input.items, selection, { method: "courier" });
    assert.equal(order.requiresQuote, true);
    assert.equal(order.deliveryMissing, false);
    assert.equal(order.total, 85.78);
    assert.equal(order.extras.length, 0);
    assert.throws(
      () =>
        buildSessionParams(
          { ...input, services: selection, delivery: null },
          order,
          "https://www.kaledudekoras.lt",
          "TEST",
        ),
      /Individualus pasiūlymas/,
    );
  }
  const withWork = buildOrder(input.items, {
    installation: true,
    removal: true,
  });
  assert.equal(withWork.installationEstimate, 59.85);
});
test("Serveris reikalauja pristatymo būdo, paštomato kodo ir adreso tik kai jo reikia", () => {
  const withoutDelivery = { items: input.items, services, customer };
  const missing = validateCheckout(withoutDelivery);
  assert.deepEqual(missing, { ok: false, error: "Pasirinkite pristatymo būdą." });
  assert.equal(validateCheckout({ ...input, delivery: { method: "post" } }).ok, false);
  for (const parcelMachineId of ["", "abc", "1; DROP", "12345678901"])
    assert.deepEqual(
      validateCheckout({ ...input, delivery: { method: "parcel", parcelMachineId } }),
      { ok: false, error: "Pasirinkite Omniva paštomatą." },
    );
  const noAddress = { ...customer, address: "", city: "" };
  const parcel = validateCheckout({
    ...input,
    customer: noAddress,
    delivery: { method: "parcel", parcelMachineId: "12345", price: 0 },
  });
  assert.equal(parcel.ok, true);
  if (parcel.ok)
    assert.deepEqual(parcel.value.delivery, { method: "parcel", parcelMachineId: "12345" });
  assert.deepEqual(validateCheckout({ ...input, customer: noAddress }), {
    ok: false,
    error: "Įrašykite adresą.",
  });
  // Montuojant pristatymo nereikia, bet adresas būtinas.
  const installing = validateCheckout({
    ...withoutDelivery,
    services: { installation: true, removal: true },
  });
  assert.equal(installing.ok, true);
  if (installing.ok) assert.equal(installing.value.delivery, null);
  assert.equal(
    validateCheckout({
      ...withoutDelivery,
      customer: noAddress,
      services: { installation: true, removal: true },
    }).ok,
    false,
  );
});
test("Užsakymo užklausa perskaičiuojama iš katalogo ir suderinama su esamos integracijos validatoriumi", () => {
  const prepared = prepareOrderInquiry({
    ...input,
    total: 0,
    items: [{ ...input.items[0], price: 0 }],
  });
  assert.equal(prepared.ok, true);
  if (!prepared.ok) return;
  const f = prepared.formData;
  const q = validateInquiry({
    name: f.get("name"),
    phone: f.get("phone"),
    email: f.get("email"),
    address: f.get("address"),
    message: f.get("message"),
    services: f.getAll("services"),
  });
  assert.equal(q.ok, true);
  assert.match(String(f.get("message")), /85,78/);
  assert.deepEqual(f.getAll("services"), ["Lempučių pirkimas"]);
  const installed = prepareOrderInquiry({
    ...input,
    services: { installation: true, removal: true },
  });
  if (!installed.ok) throw new Error(installed.error);
  assert.equal(installed.formData.getAll("services").length, 2);
  assert.match(String(installed.formData.get("message")), /59,85/);
});

test("Stripe gauna pristatymo eilutę, paštomatą ir pristatymo būdą lentelei", () => {
  const order = buildOrder(input.items, services, {
    method: "parcel",
    parcelMachine: machine,
  });
  const session = buildSessionParams(
    { ...input, delivery: { method: "parcel", parcelMachineId: machine.id } },
    order,
    "https://www.kaledudekoras.lt",
    "TEST-ONLY",
  );
  assert.equal(session.line_items?.[0].price_data?.unit_amount, 4289);
  assert.equal(session.line_items?.[0].quantity, 2);
  const delivery = session.line_items?.[1].price_data;
  assert.equal(delivery?.unit_amount, 229);
  assert.equal(delivery?.product_data?.name, "Pristatymas į Omniva paštomatą");
  assert.match(String(delivery?.product_data?.description), /Akropolio/);
  assert.equal(session.metadata?.order_number, "TEST-ONLY");
  assert.equal(session.metadata?.meters, "15");
  assert.equal(session.metadata?.delivery, "parcel");
  assert.equal(session.metadata?.parcel_machine, describeParcelMachine(machine));
  assert.match(JSON.stringify(session.custom_text), /paštomatą/);

  const courier = buildSessionParams(
    input,
    buildOrder(input.items, services, { method: "courier" }),
    "https://www.kaledudekoras.lt",
    "TEST-ONLY",
  );
  assert.equal(courier.line_items?.[1].price_data?.unit_amount, 499);
  assert.equal(courier.metadata?.delivery, "courier");
  assert.equal(courier.metadata?.parcel_machine, undefined);

  const row = (metadata: Record<string, string>) =>
    sheetFieldsFromSession({
      id: "cs_test_delivery",
      created: 1791357300,
      amount_total: 8027,
      metadata,
    } as unknown as Stripe.Checkout.Session).Pristatymas;
  assert.equal(
    row({ delivery: "parcel", parcel_machine: describeParcelMachine(machine) }),
    "Omniva paštomatas: Vilniaus Akropolio paštomatas, Ozo g. 25, Vilniaus m. (kodas 12345)",
  );
  assert.equal(
    row({ delivery: "courier", address: "Testo gatvė 1", city: "Vilnius" }),
    "Kurjeris: Testo gatvė 1, Vilnius",
  );
  assert.equal(row({ installation: "yes" }), "Atvešime montavimo metu");
});

test("Omniva sąrašas: tik Lietuvos paštomatai, paieška be lietuviškų raidžių", () => {
  const raw = [
    { ZIP: "99001", NAME: "Šiaulių Akropolio paštomatas", TYPE: "0", A0_NAME: "LT", A2_NAME: "Šiaulių m. sav.", A3_NAME: "Šiaulių m.", A5_NAME: "Aido g.", A7_NAME: "8", comment_lit: "Prie įėjimo" },
    { ZIP: "99002", NAME: "Alytaus paštomatas", TYPE: "0", A0_NAME: "LT", A2_NAME: "Alytaus m. sav.", A3_NAME: "", A5_NAME: "Naujoji g.", A7_NAME: "2C" },
    { ZIP: "99003", NAME: "Paštas", TYPE: "1", A0_NAME: "LT" },
    { ZIP: "96331", NAME: "Tallinna pakiautomaat", TYPE: "0", A0_NAME: "EE" },
    { ZIP: "bad", NAME: "Be kodo", TYPE: "0", A0_NAME: "LT" },
    null,
  ];
  const list = parseParcelMachines(raw);
  assert.deepEqual(list, [
    { id: "99002", name: "Alytaus paštomatas", address: "Naujoji g. 2C, Alytaus m. sav.", note: "" },
    { id: "99001", name: "Šiaulių Akropolio paštomatas", address: "Aido g. 8, Šiaulių m.", note: "Prie įėjimo" },
  ]);
  assert.deepEqual(parseParcelMachines({ error: true }), []);
  assert.deepEqual(searchParcelMachines(list, "siauliu aido").map((m) => m.id), ["99001"]);
  // Vardininkas randa kilmininką: „Šiauliai“ → „Šiaulių m.“, „Alytus“ → „Alytaus“.
  assert.deepEqual(searchParcelMachines(list, "Šiauliai").map((m) => m.id), ["99001"]);
  assert.deepEqual(searchParcelMachines(list, "alytus naujoji").map((m) => m.id), ["99002"]);
  assert.deepEqual(searchParcelMachines(list, "  ").map((m) => m.id), ["99002", "99001"]);
  assert.deepEqual(searchParcelMachines(list, "kaunas"), []);
});

test("Rinkinys: viena motininė ir reikiamas papildomų sekcijų kiekis, komplektas tik kai pigiau", () => {
  const ids = (set: ReturnType<typeof buildLightSet>) =>
    set!.lines.map((l) => [l.product.id, l.quantity]);
  // Kainos su 10 % pakėlimu: XP motininė 27,49, papildoma 19,79, 45 m komplektas 107,79.
  // 7,5 m — tik motininė; 30 m — motininė ir 3 papildomos (27,49 + 3 × 19,79).
  assert.deepEqual(ids(buildLightSet("xp", 7.5)), [["63100", 1]]);
  const thirty = buildLightSet("xp", 30)!;
  assert.deepEqual(ids(thirty), [["63100", 1], ["63110", 3]]);
  assert.equal(thirty.total, 86.86);
  assert.equal(thirty.savings, 0);
  // 32 m apvalinama iki 5 sekcijų (37,5 m): 27,49 + 4 × 19,79 pigiau nei 45 m komplektas.
  const rounded = buildLightSet("xp", 32)!;
  assert.equal(rounded.meters, 37.5);
  assert.equal(rounded.total, 106.65);
  // 45 m: komplektas (107,79) pigesnis nei 27,49 + 5 × 19,79 = 126,44.
  const kit = buildLightSet("xp", 45)!;
  assert.deepEqual(ids(kit), [["xp-45", 1]]);
  assert.equal(kit.savings, 18.65);
  // 50 m = 7 sekcijos: 45 m komplektas + 1 papildoma (107,79 + 19,79).
  assert.deepEqual(ids(buildLightSet("xp", 50)), [["xp-45", 1], ["63110", 1]]);
  assert.equal(buildLightSet("xp", 50)!.total, 127.58);
  // LLinks 100 m = 14 sekcijų: 60 m komplektas + 6 papildomos (230,99 + 6 × 35,19).
  const llinks = buildLightSet("llinks", 100)!;
  assert.deepEqual(ids(llinks), [["llinks-60", 1], ["61040", 6]]);
  assert.equal(llinks.total, 442.13);
  assert.equal(llinks.meters, 105);
  assert.equal(llinks.leds, 700);
  // Krepšelis ir serveris perskaičiuoja tą pačią sumą.
  const order = buildOrder(lightSetItems(llinks), services);
  assert.equal(order.productsTotal, llinks.total);
  assert.equal(validateCheckout({ ...input, items: lightSetItems(llinks) }).ok, true);
  // Ilgiausias rinkinys telpa į 99 vienetų eilutę; ribinės reikšmės atmetamos.
  const longest = buildLightSet("xp", 750)!;
  assert.ok(longest.lines.every((l) => l.quantity <= 99));
  assert.equal(longest.sections, 100);
  for (const m of [0, -1, NaN, Infinity, 750.1])
    assert.equal(buildLightSet("xp", m), null);
  assert.equal(
    [1, 2, 5, 10, 11, 12, 21, 22, 99].map((n) => plural(n, "a", "b", "c")).join(""),
    "abbcccabb",
  );
});

test("Administravimas: sesija galioja tik su tuo pačiu slaptažodžiu ir iki galiojimo pabaigos", () => {
  const password = "slaptas-žodis-2026";
  const now = Date.UTC(2026, 9, 12);
  const day = 24 * 60 * 60 * 1000;
  const token = createSessionToken(password, now);
  assert.equal(verifySessionToken(token, password, now + day), true);
  assert.equal(verifySessionToken(token, "kitas-slaptažodis", now + day), false);
  assert.equal(verifySessionToken(token, password, now + SESSION_DAYS * day + 1), false);
  // Galiojimo pratęsti negalima: pakeitus datą, parašas nebetinka.
  const [expires, signature] = token.split(".");
  assert.equal(verifySessionToken(`${Number(expires) + day}.${signature}`, password, now), false);
  for (const bad of [undefined, "", "abc", `${token}.x`, `${expires}.`])
    assert.equal(verifySessionToken(bad, password, now), false);
  assert.equal(passwordMatches(password, password), true);
  assert.equal(passwordMatches("slaptas", password), false);
});

test("Administravimas išjungtas, kol slaptažodis nenustatytas arba per trumpas", () => {
  const previous = process.env.ADMIN_PASSWORD;
  try {
    delete process.env.ADMIN_PASSWORD;
    assert.equal(adminPassword(), null);
    process.env.ADMIN_PASSWORD = "trumpas";
    assert.equal(adminPassword(), null);
    process.env.ADMIN_PASSWORD = "pakankamai-ilgas";
    assert.equal(adminPassword(), "pakankamai-ilgas");
  } finally {
    if (previous === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = previous;
  }
});

test("Dizainas: priimami tik žinomi pavadinimai", () => {
  assert.equal(isSiteTheme("christmas"), true);
  assert.equal(isSiteTheme("halloween"), true);
  for (const value of ["", "Halloween", "admin", null, undefined, 1])
    assert.equal(isSiteTheme(value), false);
});

/** Runs `fn` with a fixed discount secret, restoring the environment afterwards. */
function withDiscountSecret(fn: () => void) {
  const previous = { secret: process.env.DISCOUNT_CODE_SECRET, stripe: process.env.STRIPE_SECRET_KEY };
  try {
    process.env.DISCOUNT_CODE_SECRET = "test-only-discount-secret";
    fn();
  } finally {
    if (previous.secret === undefined) delete process.env.DISCOUNT_CODE_SECRET;
    else process.env.DISCOUNT_CODE_SECRET = previous.secret;
    if (previous.stripe === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = previous.stripe;
  }
}

test("Laimės ratas sąžiningas: prizo dalių plotas lygus jo tikimybei, o sustojimas atitinka prizą", () => {
  const last = wheelSlices[wheelSlices.length - 1];
  assert.equal(wheelSlices[0].start, 0);
  assert.ok(Math.abs(last.end - 360) < 1e-9);
  for (const prize of wheelPrizes) {
    const area = wheelSlices.filter((s) => s.percent === prize.percent).reduce((sum, s) => sum + s.end - s.start, 0);
    assert.ok(Math.abs(area - prize.chance * 3.6) < 1e-9, `${prize.percent}% užima ${area}°`);
  }
  assert.equal(wheelPrizes.reduce((sum, p) => sum + p.chance, 0), 100);
  // Every stopping point over the whole wheel: the prize counts match the published chances.
  const won: Record<number, number> = {};
  for (let hundredth = 0; hundredth < 36000; hundredth++) {
    const { angle, percent } = spinWheelPrize(hundredth / 100);
    const slice = wheelSlices.find((s) => angle > s.start && angle < s.end)!;
    assert.equal(slice.percent, percent);
    won[percent] = (won[percent] ?? 0) + 1;
  }
  for (const prize of wheelPrizes) assert.ok(Math.abs(won[prize.percent] - prize.chance * 360) <= 2);
});

test("Nuolaidos kodas: pasirašytas, galioja 7 dienas, negalima pakeisti procento ar parašo", () => {
  withDiscountSecret(() => {
    const now = Date.UTC(2026, 9, 17, 12);
    const day = 24 * 60 * 60 * 1000;
    const created = createDiscountCode(7, now);
    assert.match(created.code, /^RATAS7-[2-9A-HJ-NP-Z]{6}-[2-9A-HJ-NP-Z]{6}$/);
    assert.deepEqual(verifyDiscountCode(created.code, now), created);
    assert.equal(verifyDiscountCode(` ${created.code.toLowerCase()} `, now)?.percent, 7);
    assert.ok(verifyDiscountCode(created.code, now + 7 * day));
    assert.equal(verifyDiscountCode(created.code, now + 8 * day), null);
    assert.equal(verifyDiscountCode(created.code.replace("RATAS7", "RATAS10"), now), null);
    const signature = created.code.slice(-6);
    const forged = created.code.slice(0, -6) + (signature[0] === "A" ? "B" : "A") + signature.slice(1);
    assert.equal(verifyDiscountCode(forged, now), null);
    assert.throws(() => createDiscountCode(50, now));
    assert.equal(verifyDiscountCode("RATAS50-ABCDEF-ABCDEF", now), null);
  });
  const previous = { secret: process.env.DISCOUNT_CODE_SECRET, stripe: process.env.STRIPE_SECRET_KEY };
  try {
    delete process.env.DISCOUNT_CODE_SECRET;
    delete process.env.STRIPE_SECRET_KEY;
    assert.equal(discountsEnabled(), false);
    assert.equal(verifyDiscountCode("RATAS5-ABCDEF-ABCDEF"), null);
  } finally {
    if (previous.secret !== undefined) process.env.DISCOUNT_CODE_SECRET = previous.secret;
    if (previous.stripe !== undefined) process.env.STRIPE_SECRET_KEY = previous.stripe;
  }
});

test("Nuolaida taikoma tik prekėms nuo dabartinių kainų, o Stripe suma sutampa su užsakymo suma", () => {
  const items = [...input.items, { productId: "63110", mode: "buy" as const, quantity: 3 }];
  const discount = { code: "RATAS7-TEST00-TEST00", percent: 7 };
  const full = buildOrder(items, services, { method: "courier" });
  const order = buildOrder(items, services, { method: "courier" }, discount);
  const unitDiscount = (price: number) => Math.round(price * 100) - Math.round((Math.round(price * 100) * 93) / 100);
  assert.equal(order.productsTotal, full.productsTotal);
  assert.equal(order.discountTotal, (unitDiscount(raised(38.99)) * 2 + unitDiscount(raised(17.99)) * 3) / 100);
  assert.equal(order.total, Math.round((full.total - order.discountTotal) * 100) / 100);
  assert.equal(order.extras[0].paidUnitPrice, pricing.delivery.courier);

  const session = buildSessionParams({ ...input, items }, order, "https://www.kaledudekoras.lt", "KD-TEST-DISCOUNT");
  const charged = (session.line_items ?? []).reduce(
    (sum, line) => sum + (line.price_data?.unit_amount ?? 0) * (line.quantity ?? 0), 0);
  assert.equal(charged, Math.round(order.total * 100));
  assert.equal(session.line_items?.[0].price_data?.unit_amount, Math.round(4289 * 0.93));
  assert.equal(session.metadata?.discount_code, discount.code);
  assert.equal(session.metadata?.discount_percent, "7");
  assert.match(String(session.metadata?.items_0), /Nuolaida RATAS7-TEST00-TEST00 \(−7 %\)/);
  assert.match(String(session.line_items?.[0].price_data?.product_data?.description), /−7 % nuolaida/);
  // No discount: nothing changes.
  assert.equal(full.discount, null);
  assert.equal(full.discountTotal, 0);
});

test("Nuolaidos kodas tikrinamas užklausoje ir įrašomas apmokėto užsakymo laiške", () => {
  withDiscountSecret(() => {
    const { code } = createDiscountCode(5);
    const valid = prepareOrderInquiry({ ...input, services: { installation: true, removal: true }, delivery: null, discountCode: code });
    assert.equal(valid.ok, true);
    assert.match(String(valid.ok && valid.formData.get("message")), new RegExp(`Nuolaida ${code} \\(−5 %\\)`));
    const invalid = prepareOrderInquiry({ ...input, services: { installation: true, removal: true }, delivery: null, discountCode: "RATAS5-AAAAAA-AAAAAA" });
    assert.equal(invalid.ok, false);
  });
  const parsed = validateCheckout({ ...input, discountCode: "  ratas5-abc  " });
  assert.equal(parsed.ok && parsed.value.discountCode, "ratas5-abc");
  const fields = sheetFieldsFromSession({
    id: "cs_test_discount", created: 1791357300, amount_total: 7252,
    metadata: { order_number: "TEST-DISCOUNT", discount_code: "RATAS7-TEST00-TEST00", discount_percent: "7" },
  } as unknown as Stripe.Checkout.Session);
  assert.equal(fields.Nuolaida, "RATAS7-TEST00-TEST00 (−7 %)");
});


test("Visos 128 kalėdinės prekės naudoja šaltinio kainą su vienu 10 % priedu ir turi nuotrauką", () => {
  const expected = JSON.parse(readFileSync(join(process.cwd(), "tests/fixtures/christmas-retail-prices.json"), "utf8")) as { id: string; basePrice: number; price: number }[];
  assert.equal(expected.length, 128);
  assert.equal(products.filter(p => p.kind === "decoration").length, 128);
  for (const row of expected) {
    const p = getProduct(row.id, "buy")!;
    assert.ok(p, row.id);
    assert.equal(p.price, row.price, row.id);
    assert.equal(Math.round(p.price * 100), Math.round(Math.round(row.basePrice * 100) * 1.1), row.id);
    assert.equal(p.deliveryBusinessDays, 4);
    assert.equal(getProduct(row.id, "rent"), undefined);
    assert.equal(p.meters, 0);
    assert.ok(existsSync(join(process.cwd(), "public", p.image)), p.image);
    assert.equal(productSchema(p).offers.availability, "https://schema.org/PreOrder");
  }
});

test("Mišriame krepšelyje dekoracijų kainos ir rato nuolaida sutampa su Stripe centais", () => {
  const decoration = products.find(p => p.kind === "decoration")!;
  const items = [...input.items, { productId: decoration.id, mode: "buy" as const, quantity: 3 }];
  const order = buildOrder(items, input.services, { method: "courier" }, { code: "TEST", percent: 10 });
  const session = buildSessionParams({ ...input, items }, order, "https://www.kaledudekoras.lt", "TEST-CHRISTMAS");
  const line = order.products.find(p => p.productId === decoration.id)!;
  assert.match(line.detail!, /4 darbo dienas/);
  const charged = session.line_items!.reduce((total, row) => total + row.price_data!.unit_amount! * row.quantity!, 0);
  assert.equal(charged, Math.round(order.total * 100));
  assert.equal(line.paidUnitPrice, Math.round(Math.round(decoration.price * 100) * .9) / 100);
});
