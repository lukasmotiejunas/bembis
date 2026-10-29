"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  isMetaPageAllowed, isPixelId, marketingConsentSnapshot,
  prepareMetaPixel, subscribeMarketingConsent, trackMetaEvent,
} from "@/lib/meta-pixel";

export default function MetaPixel({ pixelId, hostname }: { pixelId: string; hostname: string }) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeMarketingConsent, marketingConsentSnapshot, () => null);
  const [ready, setReady] = useState(false);
  const lastPage = useRef("");

  useEffect(() => {
    if (consent !== "granted" || !isPixelId(pixelId) || !isMetaPageAllowed(window.location.href, hostname)) {
      window.fbq?.("consent", "revoke");
      return;
    }
    prepareMetaPixel(pixelId);
    // Only fetch the SDK after the consented queue has been initialized.
    const frame = window.requestAnimationFrame(() => {
      setReady(true);
      if (lastPage.current !== pathname && trackMetaEvent("PageView")) lastPage.current = pathname;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [consent, hostname, pathname, pixelId]);

  useEffect(() => {
    const contactClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a[href^="tel:"],a[href^="mailto:"],a[href^="https://wa.me/"]')) trackMetaEvent("Contact");
    };
    document.addEventListener("click", contactClick);
    return () => document.removeEventListener("click", contactClick);
  }, []);

  if (!ready || consent !== "granted" || !isPixelId(pixelId)) return null;
  return <Script id="meta-pixel-sdk" src="https://connect.facebook.net/en_US/fbevents.js" strategy="afterInteractive" />;
}
