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
  assert.equal(ll.rentalTotal, 215.52);
  assert.equal(ll.workTotal, 191.52);
  assert.equal(ll.total, 407.04);
  assert.equal(buildEstimate("xp")!.total, 335.04);
  const own = buildEstimate("client")!;
  assert.equal(own.rentalTotal, 0);
  assert.equal(own.workTotal, 287.52);
  assert.equal(own.total, 287.52);
  const extra = buildEstimate("xp", 12, 12, 1)!;
  assert.equal(extra.meters, 49);
  assert.equal(extra.rentalTotal, 146.51);
  assert.equal(extra.workTotal, 195.51);
  assert.equal(extra.total, 342.02);
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
  assert.equal(small.rentalTotal, 1.2);
  assert.equal(small.workTotal, 1.6);
  assert.equal(small.total, 2.8);
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
test("Patvirtintas pristatymas nemokamas, o individualių darbų sąmata neapmokestinama", () => {
  assert.equal(pricing.deliveryFee, 0);
  const simple = buildOrder(input.items, services);
  assert.equal(simple.requiresQuote, false);
  assert.equal(simple.deliveryNeedsQuote, false);
  assert.equal(simple.total, 77.98);
  assert.equal(simple.extras[0].total, 0);
  for (const selection of [
    { installation: true, removal: true },
    { installation: false, removal: true },
  ]) {
    const order = buildOrder(input.items, selection);
    assert.equal(order.requiresQuote, true);
    assert.equal(order.total, 77.98);
    assert.equal(order.extras.length, 0);
    assert.throws(
      () =>
        buildSessionParams(
          { ...input, services: selection },
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

test("Patvirtinto pristatymo atveju tikslus užsakymas išlaiko Stripe kainas ir metaduomenis", () => {
  const originalFee = pricing.deliveryFee;
  // Tik testo fikstūra; svetainės konfigūracija ir Stripe režimas nekeičiami.
  pricing.deliveryFee = null;
  const missing = buildOrder(input.items, services);
  assert.equal(missing.requiresQuote, true);
  assert.equal(missing.total, 77.98);
  assert.throws(() =>
    buildSessionParams(input, missing, "https://www.kaledudekoras.lt", "TEST"),
  );
  pricing.deliveryFee = 0;
  try {
    const order = buildOrder(input.items, services);
    assert.equal(order.requiresQuote, false);
    assert.equal(order.total, 77.98);
    const session = buildSessionParams(
      input,
      order,
      "https://www.kaledudekoras.lt",
      "TEST-ONLY",
    );
    assert.equal(session.line_items?.[0].price_data?.unit_amount, 3899);
    assert.equal(session.line_items?.[0].quantity, 2);
    assert.equal(session.line_items?.[1].price_data?.unit_amount, 0);
    assert.equal(session.metadata?.order_number, "TEST-ONLY");
    assert.equal(session.metadata?.meters, "15");
    const withWork = buildOrder(input.items, {
      installation: true,
      removal: true,
    });
    assert.equal(withWork.requiresQuote, true);
    assert.throws(() =>
      buildSessionParams(
        { ...input, services: { installation: true, removal: true } },
        withWork,
        "https://www.kaledudekoras.lt",
        "TEST",
      ),
    );
  } finally {
    pricing.deliveryFee = originalFee;
  }
});
