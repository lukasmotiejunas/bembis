export type AnalyticsConsent = "granted" | "denied" | null;

export const CONSENT_KEY = "kaledudekoras.analytics-consent.v1";
export const CONSENT_EVENT = "kaledudekoras:analytics-consent";
export const SETTINGS_EVENT = "kaledudekoras:analytics-settings";
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;

export function isMeasurementId(value: string) {
  return /^G-[A-Z0-9]+$/.test(value);
}

export function readConsent(value: string | null, now = Date.now()): AnalyticsConsent {
  if (!value) return null;
  try {
    const saved = JSON.parse(value);
    if (
      (saved.choice === "granted" || saved.choice === "denied") &&
      typeof saved.savedAt === "number" &&
      saved.savedAt <= now &&
      now - saved.savedAt < CONSENT_MAX_AGE
    ) return saved.choice;
  } catch {
    // Invalid or older preferences require a new choice.
  }
  return null;
}

/** Never forward query parameters, fragments or credentials to Analytics. */
export function analyticsUrl(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? `${url.origin}${url.pathname}` : "";
  } catch {
    return "";
  }
}

export type GoogleTag = (...args: unknown[]) => void;

/** One explicit page_view per route change; repeated effects do not count twice. */
export function createPageViewTracker(tag: GoogleTag, measurementId: string, initialReferrer: string) {
  let previousLocation = analyticsUrl(initialReferrer);
  let lastLocation = "";
  return (location: string, title: string) => {
    const pageLocation = analyticsUrl(location);
    if (!pageLocation || pageLocation === lastLocation) return;
    const page = {
      page_location: pageLocation,
      page_title: title,
      page_referrer: previousLocation,
    };
    // Keep automatic engagement events on the same sanitized page URL.
    tag("set", page);
    tag("event", "page_view", { ...page, send_to: measurementId });
    previousLocation = pageLocation;
    lastLocation = pageLocation;
  };
}
