"use client";
import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { sendInquiry } from "@/app/kontaktai/actions";
import { serviceOptions } from "@/lib/inquiry";
import { emailHref, phoneHref, site } from "@/lib/site";

/** Fallback when sending fails: a ready-made email to our business address. */
function mailtoFrom(data: FormData) {
  const field = (key: string) => String(data.get(key) ?? "").trim();
  const services = data.getAll("services").map(String);
  const body = [
    `Vardas: ${field("name")}`,
    `Telefonas: ${field("phone")}`,
    field("email") && `El. paštas: ${field("email")}`,
    field("address") && `Adresas: ${field("address")}`,
    services.length > 0 && `Domina: ${services.join(", ")}`,
    field("message") && `\nŽinutė:\n${field("message")}`,
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${site.email}?subject=${encodeURIComponent(`Užklausa iš svetainės — ${field("name")}`)}&body=${encodeURIComponent(body)}`;
}

export default function InquiryForm({
  defaultServices = [],
  defaultMessage = "",
}: {
  defaultServices?: string[];
  defaultMessage?: string;
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<{
    message: string;
    mailto: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setError(null);
    startTransition(async () => {
      const result = await sendInquiry(data);
      if (result.ok) {
        form.reset();
        setSent(true);
      } else {
        setError({ message: result.error, mailto: mailtoFrom(data) });
      }
    });
  }

  if (sent) {
    return (
      <div
        className="flex flex-col items-start rounded-[2rem] bg-white p-8 sm:p-10"
        role="status"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-glow shadow-[0_0_40px_rgb(244_176_62/0.5)]">
          <CheckCircle2 className="size-7 text-pine-950" aria-hidden="true" />
        </span>
        <h3 className="mt-6 text-3xl font-semibold text-pine-900">
          Ačiū, užklausą gavome!
        </h3>
        <p className="mt-3 text-lg leading-relaxed text-stone">
          Susisieksime su jumis kuo greičiau.
        </p>
        <p className="mt-3 leading-relaxed text-stone">
          Skubu? Skambinkite{" "}
          <a
            href={phoneHref}
            className="font-bold whitespace-nowrap text-pine-900 underline underline-offset-4"
          >
            {site.phone}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="btn btn-outline mt-8"
        >
          Siųsti dar vieną užklausą
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-[2rem] bg-white p-6 sm:p-10"
    >
      <h3 className="text-2xl font-semibold text-pine-900">
        Palikite užklausą
      </h3>
      <p className="mt-1 text-stone">
        Užtenka vardo ir telefono — paskambinsime patys.
      </p>

      {/* Spam trap: hidden from people, bots fill it in */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Svetainė
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-pine-900">
            Vardas *
          </span>
          <input
            name="name"
            required
            minLength={2}
            autoComplete="name"
            className="field"
            placeholder="Jūsų vardas"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-pine-900">
            Telefonas *
          </span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="field"
            placeholder="+370 6.. ....."
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-pine-900">
            El. paštas
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="field"
            placeholder="vardas@pastas.lt"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-pine-900">
            Adresas ar miestas
          </span>
          <input
            name="address"
            autoComplete="street-address"
            className="field"
            placeholder="Pvz., Vilnius, Pilaitė"
          />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2.5 text-sm font-bold text-pine-900">
          Kas jus domina?
        </legend>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map((s) => (
            <label
              key={s}
              className="cursor-pointer rounded-full border-[1.5px] border-sand bg-white px-4 py-2.5 text-sm font-semibold text-pine-900 transition-colors select-none hover:border-pine-900/40 has-checked:border-pine-900 has-checked:bg-pine-900 has-checked:text-snow has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-glow-deep"
            >
              <input
                type="checkbox"
                name="services"
                value={s}
                defaultChecked={defaultServices.includes(s)}
                className="sr-only"
              />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 block">
        <span className="mb-1.5 block text-sm font-bold text-pine-900">
          Žinutė
        </span>
        <textarea
          name="message"
          defaultValue={defaultMessage}
          rows={4}
          maxLength={2000}
          className="field resize-y"
          placeholder="Papasakokite apie savo namus: kokio dydžio, ką norėtumėte papuošti..."
        />
      </label>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl bg-berry/10 p-4 text-sm text-pine-900"
        >
          <p className="font-semibold text-berry">{error.message}</p>
          <a
            href={error.mailto}
            className="mt-3 inline-flex items-center gap-2 font-bold text-pine-900 underline underline-offset-4"
          >
            <Mail className="size-4" aria-hidden="true" />
            Siųsti el. paštu
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary mt-7 w-full disabled:opacity-60 sm:w-auto"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {pending ? "Siunčiama…" : "Siųsti užklausą"}
      </button>
      <p className="mt-3 text-sm text-stone">
        Arba skambinkite{" "}
        <a
          href={phoneHref}
          className="font-bold whitespace-nowrap text-pine-900"
        >
          {site.phone}
        </a>{" "}
        ·{" "}
        <a href={emailHref} className="font-bold text-pine-900">
          {site.email}
        </a>
      </p>
    </form>
  );
}
