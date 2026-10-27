import { readConsent } from "./analytics";

export const MARKETING_CONSENT_KEY = "kaledudekoras.marketing-consent.v1";
export const MARKETING_CONSENT_EVENT = "kaledudekoras:marketing-consent";
let memoryConsent: string | null = null;

export function isPixelId(value: string) {
  return /^\d{8,25}$/.test(value);
}

export function marketingConsentSnapshot() {
  if (typeof window === "undefined") return null;
  try {
    return readConsent(memoryConsent ?? window.localStorage.getItem(MARKETING_CONSENT_KEY));
  } catch {
    return readConsent(memoryConsent);
  }
}

export function subscribeMarketingConsent(notify: () => void) {
  const storageChanged = (event: StorageEvent) => {
    if (event.key === MARKETING_CONSENT_KEY || event.key === null) {
      memoryConsent = event.newValue;
      notify();
    }
  };
  window.addEventListener("storage", storageChanged);
  window.addEventListener(MARKETING_CONSENT_EVENT, notify);
  return () => {
    window.removeEventListener("storage", storageChanged);
    window.removeEventListener(MARKETING_CONSENT_EVENT, notify);
  };
}

export function saveMarketingConsent(choice: "granted" | "denied") {
  memoryConsent = JSON.stringify({ choice, savedAt: Date.now() });
  try { window.localStorage.setItem(MARKETING_CONSENT_KEY, memoryConsent); } catch {}
  window.dispatchEvent(new Event(MARKETING_CONSENT_EVENT));
}

export type MetaEvent = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Lead" | "Contact";
export type MetaParameters = {
  content_ids?: string[];
  content_type?: "product";
  currency?: "EUR";
  value?: number;
  num_items?: number;
};

export interface MetaPixelQueue {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: MetaPixelQueue;
  loaded: boolean;
  version: string;
  disablePushState?: boolean;
}

declare global {
  interface Window {
    fbq?: MetaPixelQueue;
    _fbq?: MetaPixelQueue;
    kaledudekorasMetaPixel?: string;
  }
}

// The SDK reads the current URL itself. Do not load/fire on private routes or
// URLs carrying form text, checkout IDs or unknown query parameters.
export function isMetaPageAllowed(value: string, hostname: string) {
  try {
    const url = new URL(value);
    if (url.hostname.replace(/^www\./, "") !== hostname.replace(/^www\./, "")) return false;
    if (!/^https?:$/.test(url.protocol) || /^\/(?:admin|api|checkout\/success)(?:\/|$)/.test(url.pathname)) return false;
    if (url.hash && !/^#(?:forma|xp|llinks|kainos|pristatymas)$/.test(url.hash)) return false;
    let allowed = true;
    url.searchParams.forEach((_, key) => {
      if (!/^(?:fbclid|utm_(?:source|medium|campaign|term|content|id))$/.test(key)) allowed = false;
    });
    return allowed;
  } catch { return false; }
}

export function prepareMetaPixel(pixelId: string) {
  if (!isPixelId(pixelId)) return;
  if (!window.fbq) {
    const queue = function (...args: unknown[]) {
      if (queue.callMethod) queue.callMethod(...args);
      else queue.queue.push(args);
    } as MetaPixelQueue;
    queue.queue = [];
    queue.push = queue;
    queue.loaded = true;
    queue.version = "2.0";
    window.fbq = queue;
    window._fbq ??= queue;
  }
  // Route PageViews are explicit; no automatic button/form events or matching.
  window.fbq.disablePushState = true;
  if (window.kaledudekorasMetaPixel !== pixelId) {
    window.fbq("set", "autoConfig", false, pixelId);
    window.fbq("init", pixelId);
    window.kaledudekorasMetaPixel = pixelId;
  }
  window.fbq("consent", "grant");
}

export function trackMetaEvent(event: MetaEvent, parameters: MetaParameters = {}) {
  try {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
    if (!isPixelId(pixelId) || typeof window === "undefined" || marketingConsentSnapshot() !== "granted") return false;
    if (!isMetaPageAllowed(window.location.href, "kaledudekoras.lt") || window.kaledudekorasMetaPixel !== pixelId || !window.fbq) return false;
    window.fbq("trackSingle", pixelId, event, parameters);
    return true;
  } catch {
    // Tracking must never interrupt a form submission, cart update or checkout.
    return false;
  }
}
