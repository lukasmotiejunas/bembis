// Pristatymo būdai ir Omniva paštomatų sąrašo apdorojimas (bendra naršyklei ir serveriui).
import { formatPrice } from "../format";
import { pricing } from "./pricing";

export type DeliveryMethod = keyof typeof pricing.delivery;

export const deliveryOptions: Record<
  DeliveryMethod,
  { label: string; lineName: string; text: string }
> = {
  parcel: {
    label: "Omniva paštomatas",
    lineName: "Pristatymas į Omniva paštomatą",
    text: "Atsiimsite pasirinktame paštomate visoje Lietuvoje",
  },
  courier: {
    label: "Kurjeris",
    lineName: "Pristatymas kurjeriu",
    text: "Pristatysime nurodytu adresu Lietuvoje",
  },
};

export const isDeliveryMethod = (v: unknown): v is DeliveryMethod =>
  v === "parcel" || v === "courier";

export const cheapestDelivery = Math.min(...Object.values(pricing.delivery));

/** e.g. "Omniva paštomatas — 2,29 €, kurjeris — 4,99 €" */
export const deliveryPricesText = `Omniva paštomatas — ${formatPrice(pricing.delivery.parcel)}, kurjeris — ${formatPrice(pricing.delivery.courier)}`;

export interface ParcelMachine {
  /** Omniva paštomato kodas */
  id: string;
  name: string;
  /** Gatvė ir numeris, miestas */
  address: string;
  /** Kaip rasti paštomatą (Omniva komentaras) */
  note: string;
}

/** Omniva locations.json → Lithuanian parcel machines, sorted by name (names start with the town). */
export function parseParcelMachines(raw: unknown): ParcelMachine[] {
  if (!Array.isArray(raw)) return [];
  const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const machines: ParcelMachine[] = [];
  for (const l of raw) {
    if (!l || typeof l !== "object") continue;
    const r = l as Record<string, unknown>;
    // TYPE "0" is a parcel machine; "1" would be a post office.
    if (text(r.A0_NAME) !== "LT" || text(r.TYPE) !== "0") continue;
    const id = text(r.ZIP);
    const name = text(r.NAME);
    if (!/^\d{3,10}$/.test(id) || !name) continue;
    const town = text(r.A3_NAME) || text(r.A2_NAME);
    const street = [text(r.A5_NAME), text(r.A7_NAME)].filter(Boolean).join(" ");
    machines.push({
      id,
      name,
      address: [street, town].filter(Boolean).join(", "),
      note: text(r.comment_lit),
    });
  }
  return machines.sort((a, b) => a.name.localeCompare(b.name, "lt"));
}

/** Lowercase without Lithuanian accents, so "siauliai" finds "Šiaulių". */
const fold = (s: string) =>
  s.toLocaleLowerCase("lt").normalize("NFD").replace(/\p{Diacritic}/gu, "");

/**
 * Omniva writes towns in the genitive ("Vilniaus m.", "Kauno m."), people type "Vilnius", "Kaunas".
 * Dropping the case ending of longer words lets either form match.
 */
const stem = (word: string) => (word.length >= 5 ? word.slice(0, -2) : word);

export function searchParcelMachines(list: ParcelMachine[], query: string) {
  const words = fold(query).split(/[\s,.]+/).filter(Boolean).map(stem);
  if (!words.length) return list;
  return list.filter((m) => {
    const haystack = fold(`${m.name} ${m.address}`);
    return words.every((w) => haystack.includes(w));
  });
}

export const describeParcelMachine = (m: ParcelMachine) =>
  `${m.name}, ${m.address} (kodas ${m.id})`;
