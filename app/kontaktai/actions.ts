"use server";
import { headers } from "next/headers";
import { buildInquiryEmail, validateInquiry } from "@/lib/inquiry";
import { postToAppsScript } from "@/lib/orders/sheet";
import { site } from "@/lib/site";
import { notificationRecipients } from "@/lib/notifications";

export type SendInquiryResult = { ok: true } | { ok: false; error: string };

export async function sendInquiry(formData: FormData): Promise<SendInquiryResult> {
  // Hidden "website" field: people never see it, spam bots fill it in. Pretend it worked.
  if (formData.get("website")) return { ok: true };

  const parsed = validateInquiry({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    services: formData.getAll("services"),
    message: formData.get("message"),
  });
  if (!parsed.ok) return parsed;

  const h = await headers();
  const origin = h.get("origin") ?? `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const pageUrl = h.get("referer") ?? `${origin}/kontaktai`;
  const email = buildInquiryEmail(parsed.value, pageUrl);

  try {
    await postToAppsScript({
      type: "inquiry",
      fields: email.sheetFields,
      email: { to: notificationRecipients(), subject: email.subject, text: email.text, html: email.html, replyTo: email.replyTo },
    });
    return { ok: true };
  } catch (err) {
    console.error("[contact] Could not send inquiry:", err);
    return { ok: false, error: `Nepavyko išsiųsti užklausos. Paskambinkite ${site.phone} arba parašykite ${site.email}.` };
  }
}
