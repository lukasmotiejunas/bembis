import Link from "next/link";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import FAQ from "@/components/sections/FAQ";
import PriceCalculator from "@/components/sections/PriceCalculator";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { estimateOptions, estimateRates } from "@/lib/data/priceExample";
import { pricing } from "@/lib/data/pricing";
import { pricingFaqs } from "@/lib/data/services";
import { formatPrice, money } from "@/lib/format";
import { inquiryHref, INSTALLATION_SERVICE } from "@/lib/inquiry";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kiek kainuoja kalėdinių lempučių montavimas",
  description: `Apskaičiuokite, kiek kainuos papuošti jūsų namą: įveskite matmenis ir pasirinkite lemputes. XP nuoma ${formatPrice(pricing.rentalPerMeter.xp)}/m, LLinks ${formatPrice(pricing.rentalPerMeter.llinks)}/m, montavimas su nuėmimu nuo ${formatPrice(pricing.installPerMeter)}/m.`,
  path: "/kiek-kainuoja",
});

const promises = [
  "Kaina matoma iš karto",
  "Nuėmimas jau įskaičiuotas",
  "Nemokama apžiūra",
];

const measureTips = [
  {
    title: "Ilgis ir plotis",
    text: "Išmatuokite pastato stogo kraštų ilgį ir plotį. Skaičiuoklė sudeda visas keturias kraštines: 2 × (ilgis + plotis).",
  },
  {
    title: "Papildomi kontūrai",
    text: "Norite apšviesti ir langus, duris, terasos turėklus, tvorą ar medžius? Sudėkite jų ilgius ir įrašykite bendrą sumą.",
  },
  {
    title: "Netaisyklingos formos namas",
    text: "Įveskite apytikslius matmenis. Tikslų ilgį išmatuosime nemokamos apžiūros metu.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Pradžia", path: "/" },
          { name: "Kiek kainuoja", path: "/kiek-kainuoja" },
        ])}
      />
      <PageHeader
        eyebrow="Kainų skaičiuoklė"
        title="Kiek kainuoja papuošti jūsų namą?"
        text="Įveskite pastato matmenis ir pasirinkite lemputes — standartinę kainą matysite iš karto."
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem] font-semibold text-pine-900">
          {promises.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-pine-900 text-snow">
                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </PageHeader>

      <PriceCalculator />

      <section className="bg-cream">
        <div className="container-page py-20 sm:py-24">
          <SectionHeading
            eyebrow="Standartiniai tarifai"
            title="Kaina už vieną apšviesto kontūro metrą"
            text="Darbo tarifas apima kabinimą ir nuėmimą po sezono, todėl papildomo nuėmimo mokesčio nėra."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {estimateOptions.map((option) => {
              const { rental, work } = estimateRates(option.value);
              return (
                <article
                  key={option.value}
                  className="rounded-3xl border border-sand bg-white p-7"
                >
                  <h3 className="font-sans text-lg font-bold tracking-normal text-pine-900">
                    {option.label}
                  </h3>
                  <p className="mt-1 text-sm text-stone">{option.text}</p>
                  <p className="mt-6 flex items-baseline gap-1.5">
                    <strong className="font-display text-5xl font-semibold text-pine-900">
                      {formatPrice(money(rental + work))}
                    </strong>
                    <span className="text-stone">/ m</span>
                  </p>
                  <dl className="mt-6 space-y-2.5 border-t border-sand pt-5 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone">Lempučių nuoma</dt>
                      <dd className="font-bold text-pine-900">
                        {rental ? `${formatPrice(rental)}/m` : "Netaikoma"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone">Montavimas ir nuėmimas</dt>
                      <dd className="font-bold text-pine-900">
                        {formatPrice(work)}/m
                      </dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Kaip išmatuoti"
            title="Užtenka ruletės — arba mūsų apžiūros"
          />
          <ol className="mt-10 space-y-7">
            {measureTips.map((tip, i) => (
              <li key={tip.title} className="flex gap-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-glow-soft font-display text-lg font-semibold text-glow-deep">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-sans text-lg font-bold tracking-normal text-pine-900">
                    {tip.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-stone">{tip.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-5">
          <div className="rounded-[2rem] bg-pine-900 p-7 text-snow sm:p-9">
            <h2 className="text-3xl font-semibold">Nežinote tikslių matmenų?</h2>
            <p className="mt-3 leading-relaxed text-snow/75">
              Atvažiuojame, išmatuojame ir pasakome tikslią kainą. Apžiūra
              nemokama ir be jokių įsipareigojimų.
            </p>
            <Link
              href={inquiryHref(
                [INSTALLATION_SERVICE],
                "Norėčiau nemokamos apžiūros ir tikslaus pasiūlymo savo namui.",
              )}
              className="btn btn-primary mt-7"
            >
              Užsakyti nemokamą apžiūrą
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="rounded-[2rem] border border-sand bg-white p-7 sm:p-9">
            <h2 className="text-3xl font-semibold text-pine-900">
              Norite lemputes įsigyti?
            </h2>
            <p className="mt-3 leading-relaxed text-stone">
              XP ir LLinks girliandas parduodame 7,5 m sekcijomis bei 45 m ir
              60 m komplektais. Pirktos lemputės lieka jums.
            </p>
            <Link href="/kaledines-lemputes" className="btn btn-outline mt-7">
              <ShoppingBag className="size-4" aria-hidden="true" />
              Peržiūrėti katalogą
            </Link>
          </div>
        </div>
      </section>

      <FAQ faqs={pricingFaqs} title="Klausimai apie kainą" />
    </>
  );
}
