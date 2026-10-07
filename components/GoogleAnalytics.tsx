"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  analyticsUrl, CONSENT_EVENT, CONSENT_KEY, CONSENT_MAX_AGE,
  createPageViewTracker, isMeasurementId, readConsent, SETTINGS_EVENT,
  type AnalyticsConsent, type GoogleTag,
} from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GoogleTag;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let sessionConsent: string | null = null;

function consentSnapshot() {
  try {
    return readConsent(sessionConsent ?? window.localStorage.getItem(CONSENT_KEY));
  } catch {
    return readConsent(sessionConsent);
  }
}

function subscribeConsent(notify: () => void) {
  const storageChanged = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) {
      sessionConsent = event.newValue;
      notify();
    }
  };
  window.addEventListener("storage", storageChanged);
  window.addEventListener(CONSENT_EVENT, notify);
  return () => {
    window.removeEventListener("storage", storageChanged);
    window.removeEventListener(CONSENT_EVENT, notify);
  };
}

function saveConsent(choice: Exclude<AnalyticsConsent, null>) {
  sessionConsent = JSON.stringify({ choice, savedAt: Date.now() });
  try {
    window.localStorage.setItem(CONSENT_KEY, sessionConsent);
  } catch {
    // The choice still works for this page when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

function clearAnalyticsCookies() {
  const domains = ["", window.location.hostname, `.${window.location.hostname}`];
  const parts = window.location.hostname.split(".");
  if (parts.length > 2) domains.push(`.${parts.slice(1).join(".")}`);
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""}`;
    }
  }
}

export function AnalyticsPreferencesButton({ measurementId }: { measurementId: string }) {
  if (!isMeasurementId(measurementId)) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}
      className="underline underline-offset-4 hover:text-glow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glow"
    >
      Slapukų nustatymai
    </button>
  );
}

export default function GoogleAnalytics({ measurementId, hostname }: { measurementId: string; hostname: string }) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeConsent, consentSnapshot, () => null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const tracker = useRef<ReturnType<typeof createPageViewTracker> | null>(null);
  const active = isMeasurementId(measurementId) && consent === "granted" &&
    typeof window !== "undefined" &&
    window.location.hostname.replace(/^www\./, "") === hostname.replace(/^www\./, "");

  useEffect(() => {
    const open = () => setSettingsOpen(true);
    window.addEventListener(SETTINGS_EVENT, open);
    return () => window.removeEventListener(SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    if (!isMeasurementId(measurementId)) return;
    const browser = window;
    browser[`ga-disable-${measurementId}`] = !active;
    if (!active) {
      if (consent === "denied") clearAnalyticsCookies();
      return;
    }
    if (!tracker.current) {
      browser.dataLayer ??= [];
      browser.gtag ??= function () {
        // Google's documented command queue uses Arguments objects.
        // eslint-disable-next-line prefer-rest-params
        browser.dataLayer!.push(arguments);
      };
      const tag = browser.gtag;
      tag("consent", "default", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      tag("js", new Date());
      tag("config", measurementId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_expires: CONSENT_MAX_AGE / 1000,
        cookie_update: false,
        page_location: analyticsUrl(window.location.href),
        page_referrer: analyticsUrl(document.referrer),
      });
      tracker.current = createPageViewTracker(tag, measurementId, document.referrer);
    }
    // Read the title after the route's DOM and metadata have been committed.
    const frame = window.requestAnimationFrame(() => tracker.current?.(window.location.href, document.title));
    return () => window.cancelAnimationFrame(frame);
  }, [active, consent, measurementId, pathname]);

  function choose(choice: Exclude<AnalyticsConsent, null>) {
    if (choice === "denied") {
      window[`ga-disable-${measurementId}`] = true;
      clearAnalyticsCookies();
    }
    saveConsent(choice);
    setSettingsOpen(false);
    // Remove the previously loaded tag entirely after withdrawing consent.
    if (choice === "denied" && tracker.current) window.location.reload();
  }

  if (!isMeasurementId(measurementId)) return null;
  return (
    <>
      {active && <Script id="google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />}
      {(consent === null || settingsOpen) && (
        <section aria-labelledby="analytics-consent-title" className="fixed inset-x-0 bottom-0 z-50 border-t border-sand bg-snow p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-8px_40px_rgb(18_42_31/0.12)]">
          <div className="container-page flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 id="analytics-consent-title" className="text-lg font-bold text-pine-900">Jūsų privatumas</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone">
                Su jūsų sutikimu naudojame „Google Analytics“ statistikos slapukus, kad sužinotume, kiek žmonių lankosi svetainėje ir kuriuos puslapius peržiūri. Galite atsisakyti arba vėliau pakeisti pasirinkimą.
                {" "}<Link href="/slapukai" className="font-semibold text-pine-900 underline underline-offset-4">Daugiau apie slapukus</Link>.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => choose("denied")} className="btn btn-outline flex-1 sm:flex-none">Tik būtini</button>
              <button type="button" onClick={() => choose("granted")} className="btn btn-dark flex-1 sm:flex-none">Leisti statistiką</button>
              {settingsOpen && consent !== null && <button type="button" onClick={() => setSettingsOpen(false)} className="px-3 py-2 text-sm font-semibold text-pine-900 underline underline-offset-4">Uždaryti</button>}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
