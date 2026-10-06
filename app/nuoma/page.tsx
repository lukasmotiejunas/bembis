import Link from "next/link";
import { ArrowRight, CalendarCheck, PackageX, Wrench } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ContactSection from "@/components/sections/ContactSection";
import FAQ from "@/components/sections/FAQ";
import ServiceArea from "@/components/sections/ServiceArea";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { pricing } from "@/lib/data/pricing";
import { rentalFaqs } from "@/lib/data/services";
import { seriesNames } from "@/lib/data/products";
import { LightSeries } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { breadcrumbSchema, pageMetadata, rentalServiceSchema } from "@/lib/seo";
import { inquiryHref, INSTALLATION_SERVICE } from "@/lib/inquiry";

export const metadata = pageMetadata({
  title: "XP ir LLinks lempučių nuoma Vilniuje",
  description:
    "Šiltai baltų XP ir komercinės klasės LLinks lauko LED lempučių nuoma. Standartiniai tarifai už metrą, montavimas ir nuėmimas po sezono. Vilnius ir apskritis.",
  path: "/nuoma",
});
export default function RentalPage() {
  return (
    <>
      <JsonLd
        data={[
          rentalServiceSchema(),
          breadcrumbSchema([
            { name: "Pradžia", path: "/" },
            { name: "Nuoma", path: "/nuoma" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Nuoma sezonui"
        title="Kalėdinis apšvietimas be sandėliavimo rūpesčių"
        text="Pasirinkite XP arba komercinės klasės LLinks lauko LED. Atvykstame pas jus, papuošiame ir sumontuojame, o po sezono apšvietimą nuimame bei pasiimame."
      >
        <Link href="/montavimas#kainos" className="btn btn-primary">
          Palyginti standartinę sąmatą
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </PageHeader>
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Du pasirinkimai"
          title="Nuoma skaičiuojama už metrą"
          text="Lempučių nuomos ir darbo dalys pateikiamos atskirai. Konkretaus objekto ilgį ir galutinį pasiūlymą suderiname prieš užsakymą."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {(["xp", "llinks"] as LightSeries[]).map((series) => (
            <article
              id={series}
              key={series}
              className="scroll-mt-28 rounded-[2rem] border border-sand bg-white p-7 sm:p-10"
            >
              <p className="text-sm font-bold text-glow-deep">
                {series === "llinks"
                  ? "Komercinės klasės profesionalios LED"
                  : "Aukščiausios kokybės LED"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-pine-900">
                {seriesNames[series]} lauko girliandos
              </h2>
              <p className="mt-3 text-stone">
                Šiltai baltas apšvietimas jūsų pastato ar aplinkos kontūrams.
              </p>
              <p className="mt-7">
                <strong className="font-display text-5xl text-pine-900">
                  {formatPrice(pricing.rentalPerMeter[series])}
                </strong>
                <span className="ml-2 text-stone">/ m nuomai sezonui</span>
              </p>
              <p className="mt-3 text-sm text-stone">
                Montavimas ir nuėmimas po sezono su mūsų lemputėmis —{" "}
                {formatPrice(pricing.installPerMeter)}/m. Nuėmimas jau
                įskaičiuotas į darbo tarifą.
              </p>
              <Link
                href={inquiryHref(
                  ["Lempučių nuoma", INSTALLATION_SERVICE],
                  `Domina ${seriesNames[series]} lempučių nuoma ir montavimas su nuėmimu po sezono. Prašau pasiūlymo mano objektui.`,
                )}
                className="btn btn-primary mt-7"
              >
                Gauti nuomos pasiūlymą
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-cream py-16">
        <div className="container-page grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: CalendarCheck,
              title: "Visam sezonui",
              text: "Nuomos laiką ir darbų datas suderiname su jumis.",
            },
            {
              icon: Wrench,
              title: "Montuojame ir nuimame",
              text: "Darbo tarifas apima visą kabinimo ir nuėmimo ciklą.",
            },
            {
              icon: PackageX,
              title: "Pasiimame po sezono",
              text: "Nuomotas girliandas grąžinate sutarta tvarka.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-white p-7">
              <Icon className="size-7 text-glow-deep" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-pine-900">
                {title}
              </h3>
              <p className="mt-2 text-stone">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <FAQ faqs={rentalFaqs} title="Klausimai apie nuomą" />
      <ServiceArea what="Kalėdines lemputes nuomojame ir montuojame" />
      <ContactSection
        defaultServices={["Lempučių nuoma", INSTALLATION_SERVICE]}
      />
    </>
  );
}
