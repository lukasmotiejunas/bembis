"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { marketingConsentSnapshot, subscribeMarketingConsent, trackMetaEvent } from "@/lib/meta-pixel";

export default function MetaProductView({ id, price }: { id: string; price: number }) {
  const consent = useSyncExternalStore(subscribeMarketingConsent, marketingConsentSnapshot, () => null);
  const sent = useRef("");
  useEffect(() => {
    if (consent !== "granted" || sent.current === id) return;
    const frame = window.requestAnimationFrame(() => {
      if (trackMetaEvent("ViewContent", { content_ids: [id], content_type: "product", currency: "EUR", value: price })) sent.current = id;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [consent, id, price]);
  return null;
}
