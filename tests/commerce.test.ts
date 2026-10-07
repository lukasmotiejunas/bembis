import test from "node:test";
import assert from "node:assert/strict";
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
  assert.equal(products.length, 8);
  assert.equal(new Set(products.map(productHref)).size, 8);
  for (const [id, meters, price] of expected) {
    const p = getProduct(id, "buy")!;
    assert.equal(p.meters, meters);
    assert.equal(p.price, price);
    assert.equal(p.sections * 7.5, meters);
    const schema = productSchema(p);
    assert.equal(schema.offers.price, price.toFixed(2));
    assert.equal(schema.offers.availability, "https://schema.org/InStock");
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
  }
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
    (s, [, , price], i) => s + Math.round(price * 100) * (i + 1),
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
  assert.equal(repeated.productsTotal, 1781.01);
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
      77.98,
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
  assert.equal(none.total, 77.98);
  assert.equal(none.extras.length, 0);
  assert.throws(() =>
    buildSessionParams(input, none, "https://www.kaledudekoras.lt", "TEST"),
  );
  const courier = buildOrder(input.items, services, { method: "courier" });
  assert.equal(courier.deliveryMissing, false);
  assert.equal(courier.extras[0].name, "Pristatymas kurjeriu");
  assert.equal(courier.total, 82.97);
  const noMachine = buildOrder(input.items, services, { method: "parcel" });
  assert.equal(noMachine.deliveryMissing, true);
  const parcel = buildOrder(input.items, services, {
    method: "parcel",
    parcelMachine: machine,
  });
  assert.equal(parcel.deliveryMissing, false);
  assert.equal(parcel.extras[0].name, "Pristatymas į Omniva paštomatą");
  assert.equal(parcel.extras[0].detail, "Vilniaus Akropolio paštomatas, Ozo g. 25, Vilniaus m.");
  assert.equal(parcel.total, 80.27);
  assert.equal(parcel.productsTotal, 77.98);
  for (const selection of [
    { installation: true, removal: true },
    { installation: false, removal: true },
  ]) {
    const order = buildOrder(input.items, selection, { method: "courier" });
    assert.equal(order.requiresQuote, true);
    assert.equal(order.deliveryMissing, false);
    assert.equal(order.total, 77.98);
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
  assert.match(String(f.get("message")), /77,98/);
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
  assert.equal(session.line_items?.[0].price_data?.unit_amount, 3899);
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
  // 7,5 m — tik motininė; 30 m — motininė ir 3 papildomos (24,99 + 3 × 17,99).
  assert.deepEqual(ids(buildLightSet("xp", 7.5)), [["63100", 1]]);
  const thirty = buildLightSet("xp", 30)!;
  assert.deepEqual(ids(thirty), [["63100", 1], ["63110", 3]]);
  assert.equal(thirty.total, 78.96);
  assert.equal(thirty.savings, 0);
  // 32 m apvalinama iki 5 sekcijų (37,5 m): 24,99 + 4 × 17,99 pigiau nei 45 m komplektas.
  const rounded = buildLightSet("xp", 32)!;
  assert.equal(rounded.meters, 37.5);
  assert.equal(rounded.total, 96.95);
  // 45 m: komplektas (97,99) pigesnis nei 24,99 + 5 × 17,99 = 114,94.
  const kit = buildLightSet("xp", 45)!;
  assert.deepEqual(ids(kit), [["xp-45", 1]]);
  assert.equal(kit.savings, 16.95);
  // 50 m = 7 sekcijos: 45 m komplektas + 1 papildoma (97,99 + 17,99).
  assert.deepEqual(ids(buildLightSet("xp", 50)), [["xp-45", 1], ["63110", 1]]);
  assert.equal(buildLightSet("xp", 50)!.total, 115.98);
  // LLinks 100 m = 14 sekcijų: 60 m komplektas + 6 papildomos (209,99 + 6 × 31,99).
  const llinks = buildLightSet("llinks", 100)!;
  assert.deepEqual(ids(llinks), [["llinks-60", 1], ["61040", 6]]);
  assert.equal(llinks.total, 401.93);
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
