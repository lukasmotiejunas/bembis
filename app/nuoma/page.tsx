import Link from "next/link";
import { ArrowRight, CalendarCheck, PackageX, Phone, ShieldCheck, Truck, Wrench } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ContactSection from "@/components/sections/ContactSection";
import FAQ from "@/components/sections/FAQ";
import ServiceArea from "@/components/sections/ServiceArea";
import ProductFeatureCard from "@/components/shop/ProductFeatureCard";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { buildEstimate, priceExample } from "@/lib/data/priceExample";
import { pricing } from "@/lib/data/pricing";
import { productFor, productHref } from "@/lib/data/products";
import { rentalFaqs } from "@/lib/data/services";
import { formatPrice } from "@/lib/format";
import { breadcrumbSchema, pageMetadata, rentalServiceSchema } from "@/lib/seo";
import { phoneHref, site } from "@/lib/site";

const light = productFor("rent");
const example = buildEstimate("rent");
const exampleMeters = priceExample.areas.reduce((s, a) => s + a.meters, 0);

export const metadata = pageMetadata({
  title: "Kalėdinių lempučių nuoma Vilniuje — visam sezonui",
  description: "Spalvotų lauko kalėdinių lempučių C9 nuoma sezonui Vilniuje ir Vilniaus apskrityje. Peržiūrėkite girliandą ir pasiteiraukite dėl montavimo bei nuėmimo.",
  path: "/nuoma",
});

const benefits = [
  { icon: CalendarCheck, title: "Mokate tik už sezoną", text: `${formatPrice(light.price)} už ${light.meters} m girliandą — visas Kalėdas nuo lapkričio iki sausio.` },
  { icon: PackageX, title: "Nereikia sandėliuoti", text: "Po švenčių lemputes pasiimame — jokių dėžių palėpėje." },
  { icon: ShieldCheck, title: "Sezono garantija", text: "Jei sezono metu lemputė sugestų — pakeisime ją nemokamai." },
  { icon: Wrench, title: "Sumontuojame už jus", text: "Norite — atvažiuosime, sumontuosime ir sausį viską nuimsime." },
];

const steps = [
  { title: "Užsisakote", text: "Internetu per kelias minutes arba paskambinę mums." },
  { title: "Atvežame arba sumontuojame", text: "Lapkritį–gruodį, jums patogią dieną." },
  { title: "Šviečia visą sezoną", text: "Sugedusią lemputę pakeičiame nemokamai." },
  { title: "Sausį pasiimame", text: "Po Trijų Karalių lemputes nuimame ir išsivežame." },
];

const prices = [
  { label: `Lemputės, ${light.meters} m girlianda`, value: `${formatPrice(light.price)} / sezonui` },
  { label: "Montavimas", value: `${formatPrice(pricing.installPerMeter)} / m` },
  { label: "Nuėmimas po švenčių", value: `${formatPrice(pricing.removalPerMeter)} / m` },
  { label: "Pristatymas (be montavimo)", value: formatPrice(pricing.deliveryFee) },
];

export default function RentalPage() {
  return (
    <>
      <JsonLd
        data={[
          rentalServiceSchema(light),
          breadcrumbSchema([
            { name: "Pradžia", path: "/" },
            { name: "Nuoma", path: "/nuoma" },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Nuoma"
        title="Kalėdinių lempučių nuoma Vilniuje"
        text="Išsinuomokite aukščiausios kokybės spalvotas kalėdines lemputes visam sezonui — be pirkimo ir sandėliavimo. Galime sumontuoti, o po švenčių nuimti."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={productHref(light)} className="btn btn-primary">
            Išsinuomoti — {formatPrice(light.price)} / sezonui
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <a href={phoneHref} className="btn btn-outline">
            <Phone className="size-4" aria-hidden="true" />
            {site.phone}
          </a>
        </div>
      </PageHeader>

      <section className="container-page grid gap-6 py-20 sm:py-28 lg:grid-cols-2 lg:gap-12">
        <ProductFeatureCard product={light} />
        <div className="lg:pt-4">
          <SectionHeading eyebrow="Kodėl verta nuomotis" title="Kalėdos be rūpesčių ir didelių išlaidų" />
          <ul className="mt-10 space-y-6">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-glow-soft">
                  <Icon className="size-6 text-glow-deep" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-sans text-lg font-bold text-pine-900">{title}</h3>
                  <p className="mt-1 leading-relaxed text-stone">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Kaip tai veikia" title="Nuoma per keturis žingsnius" />
            <ol className="mt-10 space-y-4">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4 rounded-3xl bg-white p-5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pine-900 text-sm font-extrabold text-snow">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-pine-900">{step.title}</p>
                    <p className="text-stone">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <SectionHeading eyebrow="Kainos" title="Kiek kainuoja nuoma?" />
            <div className="mt-10 rounded-[2rem] bg-white p-6 sm:p-8">
              <dl className="divide-y divide-sand">
                {prices.map((p) => (
                  <div key={p.label} className="flex justify-between gap-4 py-3.5 first:pt-0">
                    <dt className="text-stone">{p.label}</dt>
                    <dd className="text-right font-bold text-pine-900">{p.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 flex gap-3 rounded-2xl bg-glow-soft px-4 py-3.5 text-sm leading-relaxed text-pine-900">
                <Truck className="mt-0.5 size-4 shrink-0 text-glow-deep" aria-hidden="true" />
                <span>
                  Pavyzdžiui, {exampleMeters} m lempučių su montavimu ir nuėmimu — <strong>{formatPrice(example.total)}</strong> už visą
                  sezoną.{" "}
                  <Link href="/montavimas#kainos" className="font-bold underline underline-offset-4">
                    Žiūrėti skaičiavimą
                  </Link>
                </span>
              </p>
              <Link href={productHref(light)} className="btn btn-primary mt-6 w-full">
                Užsakyti nuomą
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQ faqs={rentalFaqs} title="Klausimai apie nuomą" />
      <ServiceArea what="Kalėdines lemputes nuomojame" />
      <ContactSection defaultServices={["Lempučių nuoma"]} />
    </>
  );
}
