"use client";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { cartTotals, resolveLines, useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/format";
import { emailHref, phoneHref, site } from "@/lib/site";
import { modeLabel } from "./ModeBadge";

export const INSTALLATION_SERVICE = "Montavimas ir nuėmimas po švenčių";
export const serviceOptions = [INSTALLATION_SERVICE, "Lempučių nuoma", "Lempučių pirkimas"];

export default function InquiryForm({ defaultServices = [] }: { defaultServices?: string[] }) {
  const [sent, setSent] = useState(false);
  const items = useCartStore((s) => s.items);
  const lines = resolveLines(items);
  const { total } = cartTotals(lines);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const field = (key: string) => String(data.get(key) ?? "").trim();
    const services = data.getAll("services").map(String);

    const body = [
      `Vardas: ${field("name")}`,
      `Telefonas: ${field("phone")}`,
      field("email") && `El. paštas: ${field("email")}`,
      field("address") && `Adresas: ${field("address")}`,
      services.length > 0 && `Domina: ${services.join(", ")}`,
      lines.length > 0 &&
        [
          "",
          "Krepšelis:",
          ...lines.map(
            (l) => `– ${l.product.name} (${modeLabel[l.mode].toLowerCase()}) × ${l.quantity} = ${formatPrice(l.unitPrice * l.quantity)}`
          ),
          `Iš viso: ${formatPrice(total)}`,
        ].join("\n"),
      field("message") && `\nŽinutė:\n${field("message")}`,
    ]
      .filter(Boolean)
      .join("\n");

    const subject = `Užklausa iš svetainės — ${field("name")}`;
    window.location.assign(`mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start rounded-[2rem] bg-white p-8 sm:p-10">
        <CheckCircle2 className="size-12 text-pine-700" aria-hidden="true" />
        <h3 className="mt-5 text-3xl font-semibold text-pine-900">Laiškas paruoštas</h3>
        <p className="mt-3 text-lg leading-relaxed text-stone">
          Jūsų el. pašto programoje atsidarė laiškas su užklausa — tereikia paspausti „Siųsti“.
        </p>
        <p className="mt-3 leading-relaxed text-stone">
          Niekas neatsidarė? Paskambinkite{" "}
          <a href={phoneHref} className="font-bold whitespace-nowrap text-pine-900 underline underline-offset-4">
            {site.phone}
          </a>{" "}
          arba parašykite{" "}
          <a href={emailHref} className="font-bold text-pine-900 underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-outline mt-8">
          Grįžti į formą
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 sm:p-10">
      <h3 className="text-2xl font-semibold text-pine-900">Palikite užklausą</h3>
      <p className="mt-1 text-stone">Užtenka vardo ir telefono — paskambinsime patys.</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-pine-900">Vardas *</span>
          <input name="name" required autoComplete="name" className="field" placeholder="Jūsų vardas" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-pine-900">Telefonas *</span>
          <input name="phone" type="tel" required autoComplete="tel" className="field" placeholder="+370 6.. ....." />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-pine-900">El. paštas</span>
          <input name="email" type="email" autoComplete="email" className="field" placeholder="vardas@pastas.lt" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-pine-900">Adresas ar miestas</span>
          <input name="address" autoComplete="street-address" className="field" placeholder="Pvz., Vilnius, Pilaitė" />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2.5 text-sm font-bold text-pine-900">Kas jus domina?</legend>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map((s) => (
            <label
              key={s}
              className="cursor-pointer rounded-full border-[1.5px] border-sand bg-white px-4 py-2.5 text-sm font-semibold text-pine-900 transition-colors select-none hover:border-pine-900/40 has-checked:border-pine-900 has-checked:bg-pine-900 has-checked:text-snow has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-glow-deep"
            >
              <input type="checkbox" name="services" value={s} defaultChecked={defaultServices.includes(s)} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      {lines.length > 0 && (
        <div className="mt-6 rounded-2xl bg-cream p-4">
          <p className="text-sm font-bold text-pine-900">Jūsų krepšelis bus pridėtas prie užklausos:</p>
          <ul className="mt-2 space-y-1 text-sm text-stone">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.mode}`} className="flex justify-between gap-4">
                <span>
                  {l.product.name} · {modeLabel[l.mode].toLowerCase()} × {l.quantity}
                </span>
                <span className="font-semibold text-pine-900">{formatPrice(l.unitPrice * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex justify-between border-t border-sand pt-2 text-sm font-bold text-pine-900">
            <span>Iš viso</span>
            <span>{formatPrice(total)}</span>
          </p>
        </div>
      )}

      <label className="mt-6 block">
        <span className="mb-1.5 block text-sm font-bold text-pine-900">Žinutė</span>
        <textarea
          name="message"
          rows={4}
          className="field resize-y"
          placeholder="Papasakokite apie savo namus: kokio dydžio, ką norėtumėte papuošti..."
        />
      </label>

      <button type="submit" className="btn btn-primary mt-7 w-full sm:w-auto">
        <Send className="size-4" aria-hidden="true" />
        Siųsti užklausą
      </button>
      <p className="mt-3 text-sm text-stone">Paspaudus atsidarys jūsų el. pašto programa su paruoštu laišku.</p>
    </form>
  );
}
