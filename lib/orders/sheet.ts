import type Stripe from "stripe";
import { fromChunks } from "./checkout";

const yesNo = (v?: string) => (v === "yes" ? "Taip" : "Ne");

const vilniusTime = new Intl.DateTimeFormat("lt-LT", {
  timeZone: "Europe/Vilnius",
  dateStyle: "short",
  timeStyle: "short",
});

/** One Google Sheet row (column name → value) for a paid Stripe Checkout session. */
export function sheetFieldsFromSession(session: Stripe.Checkout.Session): Record<string, string | number> {
  const m = session.metadata ?? {};
  return {
    Gauta: vilniusTime.format(new Date(session.created * 1000)),
    "Užsakymo nr.": m.order_number ?? session.client_reference_id ?? "",
    Būsena: "Naujas",
    Vardas: m.name ?? session.customer_details?.name ?? "",
    Telefonas: m.phone ?? session.customer_details?.phone ?? "",
    "El. paštas": m.email ?? session.customer_details?.email ?? "",
    Adresas: m.address ?? "",
    Miestas: m.city ?? "",
    "Prekės ir paslaugos": fromChunks(m, "items"),
    Montavimas: yesNo(m.installation),
    "Pageidaujama montavimo data": m.install_date ?? "",
    "Nuėmimas po švenčių": yesNo(m.removal),
    Pastabos: m.notes ?? "",
    "Suma, €": (session.amount_total ?? 0) / 100,
    "Stripe ID": session.id,
  };
}

/** Sends the row to the Apps Script attached to the orders sheet (see integrations/google-sheets). */
export async function appendOrderToSheet(fields: Record<string, string | number>) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_SECRET;
  if (!url || !secret) throw new Error("GOOGLE_SHEETS_WEBHOOK_URL or GOOGLE_SHEETS_SECRET is not set");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, fields }),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok || typeof data !== "object" || data === null || (data as { ok?: unknown }).ok !== true) {
    throw new Error(`Google Sheets responded ${res.status}: ${JSON.stringify(data)}`);
  }
}
