"use client";

import { useState, useTransition } from "react";
import { startPaymentTest } from "@/app/mokejimo-patikra/actions";

export default function PaymentTestForm({ ready }: { ready: boolean }) {
  const [pending, startTransition] = useTransition();
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <form className="mt-8 space-y-5" onSubmit={(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      setError(null);
      startTransition(async () => {
        try {
          const result = await startPaymentTest({ name: data.get("name"), email: data.get("email") });
          if ("url" in result) {
            setRedirecting(true);
            window.location.assign(result.url);
          } else setError(result.error);
        } catch { setError("Nepavyko pradėti mokėjimo. Atnaujinkite puslapį ir bandykite dar kartą."); }
      });
    }}>
      <label className="block">
        <span className="mb-2 block font-bold text-pine-900">Vardas</span>
        <input className="field" name="name" autoComplete="name" minLength={2} maxLength={100} required />
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-pine-900">El. paštas</span>
        <input className="field" name="email" type="email" autoComplete="email" maxLength={200} required />
      </label>
      {!ready && <p role="status" className="text-stone">Apmokėjimas dar neparuoštas.</p>}
      {error && <p role="alert" className="text-berry">{error}</p>}
      <button type="submit" disabled={!ready || pending || redirecting} className="btn btn-dark w-full disabled:opacity-50">
        {pending || redirecting ? "Atidaromas apmokėjimas…" : "Apmokėti 1,00 €"}
      </button>
    </form>
  );
}
