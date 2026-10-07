import { formatPrice } from "../format";
import { escapeEmailHtml } from "../notifications";

/** Complete paid-order notification; the customer is the reply-to, never a recipient. */
export function buildOrderEmail(fields: Record<string, string | number>) {
  const number = String(fields["Užsakymo nr."] || fields["Stripe ID"] || "");
  const replyTo = String(fields["El. paštas"] || "") || undefined;
  const rows = Object.entries(fields).map(([label, value]) => [
    label,
    label === "Suma, €" ? formatPrice(Number(value)) : String(value || "—"),
  ]);
  const subject = `Naujas apmokėtas užsakymas — ${number}`;
  const text = ["Naujas apmokėtas užsakymas iš svetainės", "",
    ...rows.map(([label, value]) => `${label}: ${value}`)].join("\n");
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#16231c;max-width:640px">
  <h2 style="color:#122a1f;font-size:20px">Naujas apmokėtas užsakymas</h2>
  <table style="border-collapse:collapse;width:100%;font-size:15px">${rows.map(([label, value]) =>
    `<tr><td style="padding:10px 12px;border-bottom:1px solid #e7dfd1;vertical-align:top;color:#59665f">${escapeEmailHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #e7dfd1;white-space:pre-wrap">${escapeEmailHtml(value)}</td></tr>`
  ).join("")}</table>
  <p style="color:#59665f;font-size:12px">Apmokėjimas patvirtintas.${replyTo ? " Atsakę į šį laišką, rašysite klientui." : ""}</p>
  </div>`;
  return { subject, text, html, replyTo };
}
