import { site } from "./site";

/** Shared server-side recipients for inquiries and paid orders. */
export function notificationRecipients() {
  const list = (process.env.INQUIRY_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return list.length ? [...new Set(list)] : [site.email];
}

export const escapeEmailHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
