// Contact form requests ("Palikite užklausą"): validation and the email we receive.
import { formatVilnius } from "./orders/sheet";

export const INSTALLATION_SERVICE = "Montavimas ir nuėmimas po švenčių";
export const serviceOptions = [INSTALLATION_SERVICE, "Lempučių nuoma", "Lempučių pirkimas"];

export interface Inquiry {
  name: string;
  phone: string;
  email: string;
  address: string;
  services: string[];
  message: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s()-]{6,20}$/;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function validateInquiry(raw: Record<string, unknown>): { ok: true; value: Inquiry } | { ok: false; error: string } {
  const picked = Array.isArray(raw.services) ? (raw.services as unknown[]) : [];
  const value: Inquiry = {
    name: text(raw.name, 100),
    phone: text(raw.phone, 30),
    email: text(raw.email, 200),
    address: text(raw.address, 200),
    // Only our own options are accepted, in our order — anything else sent to the server is dropped.
    services: serviceOptions.filter((s) => picked.includes(s)),
    message: text(raw.message, 2000),
  };
  if (value.name.length < 2) return { ok: false, error: "Įrašykite savo vardą." };
  if (!PHONE.test(value.phone)) return { ok: false, error: "Įrašykite teisingą telefono numerį." };
  if (value.email && !EMAIL.test(value.email)) return { ok: false, error: "Patikrinkite el. pašto adresą." };
  return { ok: true, value };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Email for us (plain text + HTML) and the matching row for the "Užklausos" sheet. */
export function buildInquiryEmail(q: Inquiry, pageUrl: string, now = new Date()) {
  const received = formatVilnius(now);
  const rows: [string, string, string?][] = [
    ["Vardas", q.name],
    ["Telefonas", q.phone, `tel:${q.phone.replace(/[^\d+]/g, "")}`],
    ["El. paštas", q.email || "—", q.email ? `mailto:${q.email}` : undefined],
    ["Adresas", q.address || "—"],
    ["Domina", q.services.join(", ") || "—"],
  ];

  const subject = `Nauja užklausa — ${q.name}${q.services.length ? ` (${q.services.join(", ")})` : ""}`;

  const textBody = [
    "Nauja užklausa iš svetainės",
    received,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Žinutė:",
    q.message || "—",
    "",
    `Išsiųsta iš ${pageUrl}`,
  ].join("\n");

  const cell = "padding:10px 12px;border-bottom:1px solid #e7dfd1;vertical-align:top";
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#16231c;max-width:560px">
  <h2 style="margin:0 0 4px;color:#122a1f;font-size:20px">Nauja užklausa iš svetainės</h2>
  <p style="margin:0 0 18px;color:#59665f;font-size:13px">${escapeHtml(received)}</p>
  <table style="border-collapse:collapse;width:100%;font-size:15px">${rows
    .map(
      ([label, value, href]) =>
        `<tr><td style="${cell};color:#59665f;width:120px">${label}</td><td style="${cell};font-weight:bold">${
          href ? `<a href="${escapeHtml(href)}" style="color:#122a1f">${escapeHtml(value)}</a>` : escapeHtml(value)
        }</td></tr>`
    )
    .join("")}</table>
  <p style="margin:20px 0 6px;color:#59665f;font-size:13px">Žinutė</p>
  <div style="white-space:pre-wrap;background:#f4eee4;padding:14px;border-radius:10px;font-size:15px;line-height:1.5">${escapeHtml(q.message || "—")}</div>
  <p style="margin:20px 0 0;color:#59665f;font-size:12px">Išsiųsta iš <a href="${escapeHtml(pageUrl)}" style="color:#59665f">${escapeHtml(pageUrl)}</a>. Atsakę į šį laišką, rašysite klientui${q.email ? "" : " (el. pašto nenurodė — skambinkite)"}.</p>
</div>`;

  const sheetFields = {
    Gauta: received,
    Vardas: q.name,
    Telefonas: q.phone,
    "El. paštas": q.email,
    Adresas: q.address,
    Domina: q.services.join(", "),
    Žinutė: q.message,
    Puslapis: pageUrl,
  };

  return { subject, text: textBody, html, replyTo: q.email || undefined, sheetFields };
}
