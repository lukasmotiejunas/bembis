import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ContactSection from "@/components/sections/ContactSection";
import FAQ from "@/components/sections/FAQ";
import ServiceArea from "@/components/sections/ServiceArea";
import ServiceGuide from "@/components/sections/ServiceGuide";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { installationFaqs, installationGuide } from "@/lib/data/services";
import { pricing } from "@/lib/data/pricing";
import { formatPrice } from "@/lib/format";
import { INSTALLATION_SERVICE } from "@/lib/inquiry";
import { breadcrumbSchema, installationServiceSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `Kalėdinių lempučių montavimas Vilniuje – nuo ${formatPrice(pricing.installPerMeter)}/m`,
  description: `Kalėdinių girliandų kabinimas ant namų, fasadų ir medžių Vilniuje bei Vilniaus rajone. Montavimas su mūsų lemputėmis nuo ${formatPrice(pricing.installPerMeter)}/m. Atsiųskite nuotrauką – parengsime pasiūlymą.`,
  path: "/montavimas",
});

const steps = [
  { title: "Atsiųskite objekto nuotraukas", text: "Nufotografuokite norimus apšviesti stogo kraštus, fasadą ar medį. Parašykite adresą, apytikslį kontūro ilgį ir kur yra elektros lizdas." },
  { title: "Suderiname sprendimą ir kainą", text: "Įvertiname aukštį, priėjimą ir tvirtinimo paviršius. Aptariame lempučių pirkimą ar nuomą, tvirtinimo būdą ir darbų datą. Jei reikia keltuvo, jo nuomą įvertiname atskirai." },
  { title: "Atvežame lemputes ir sumontuojame", text: "Sutartu laiku atvykstame su girliandomis ir montavimo įranga. Tvirtinimą parenkame pagal objektą; jei reikėtų gręžti, tai iš anksto suderiname su jumis." },
  { title: "Sutariame dėl nuėmimo", text: "Standartinis darbo tarifas apima ir nuėmimą po sezono. Jei pirktas girliandas norite palikti ilgesniam laikui, apie tai pasakykite prieš montuojant – aptarsime tinkamus tvirtinimus." },
];

export default function InstallationPage() {
  return (
    <>
      <JsonLd data={[
        installationServiceSchema(),
        breadcrumbSchema([{ name: "Pradžia", path: "/" }, { name: "Lempučių montavimas", path: "/montavimas" }]),
      ]} />
      <PageHeader
        eyebrow="Namo ir verslo erdvių puošimas"
        title="Kalėdinių lempučių montavimas Vilniuje"
        text="Kabiname lauko girliandas ant stogo kraštų, prie įėjimų, terasų ir medžių. Puošiame privačius namus, parduotuves ir biurus Vilniuje bei Vilniaus apskrityje. Galite įsigyti mūsų lemputes, išsinuomoti jas sezonui arba patikėti mums savo turimas girliandas."
      >
        <Link href="#forma" className="btn btn-primary">Gauti montavimo pasiūlymą<ArrowRight className="size-4" aria-hidden="true" /></Link>
      </PageHeader>
      <section className="container-page py-16 sm:py-20">
        <SectionHeading eyebrow="Darbų kaina" title="Kiek kainuoja pakabinti kalėdines girliandas?" text="Darbas ir lemputės skaičiuojami atskirai. Pasiūlymą parengiame pagal kontūro ilgį, aukštį, priėjimą ir pasirinktą tvirtinimą." />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            { title: "Su mūsų lemputėmis", rate: pricing.installPerMeter, text: "Montavimas ir nuėmimas po sezono. Girliandų pirkimas arba nuoma skaičiuojami papildomai." },
            { title: "Su jūsų lemputėmis", rate: pricing.clientLightsPerMeter, text: "Jūsų turimų girliandų kabinimas ir nuėmimas. Prieš darbus įvertiname jų tinkamumą laukui ir tvirtinimo galimybes." },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-sand bg-white p-7 sm:p-9">
              <h3 className="text-2xl font-semibold text-pine-900">{item.title}</h3>
              <p className="mt-5 text-stone">Nuo <strong className="font-display text-4xl text-pine-900">{formatPrice(item.rate)}</strong> / m</p>
              <p className="mt-4 leading-relaxed text-stone">{item.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-3xl leading-relaxed text-stone">Tai preliminarūs standartinių darbų tarifai. Aukštiems medžiams, sudėtingiems fasadams ar sunkiai pasiekiamiems stogo kraštams gali reikėti papildomos įrangos. Galutinę darbų apimtį ir kainą suderiname prieš montavimą. Už prekes ir paslaugas išrašome sąskaitą faktūrą.</p>
      </section>
      <ServiceGuide guide={installationGuide} />
      <section className="bg-cream py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Nuo nuotraukos iki šventinės šviesos" title="Kaip vyksta montavimas" />
          <ol className="mt-10 grid gap-6 md:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-3xl bg-white p-7">
                <span className="text-sm font-bold text-glow-deep">{index + 1} žingsnis</span>
                <h3 className="mt-3 text-2xl font-semibold text-pine-900">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <FAQ faqs={installationFaqs} title="Klausimai apie girliandų kabinimą" />
      <ServiceArea what="Kalėdines girliandas kabiname ant namų, verslo pastatų ir medžių" />
      <ContactSection defaultServices={[INSTALLATION_SERVICE]} />
    </>
  );
}
