import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  ArrowRight,
  Calculator,
  Clock,
  Lightbulb,
  Phone,
  RotateCcw,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { phoneHref, site } from "@/lib/site";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import SeasonSteps from "@/components/sections/SeasonSteps";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";
import DecorAreas from "@/components/sections/DecorAreas";
import ServiceArea from "@/components/sections/ServiceArea";
import ServiceGuide from "@/components/sections/ServiceGuide";
import JsonLd from "@/components/JsonLd";
import { INSTALLATION_SERVICE } from "@/lib/inquiry";
import { pricing } from "@/lib/data/pricing";
import { halloweenFaqs, installationFaqs, installationGuide } from "@/lib/data/services";
import { formatPrice } from "@/lib/format";
import {
  breadcrumbSchema,
  businessSchema,
  installationServiceSchema,
  pageMetadata,
} from "@/lib/seo";
import { getSiteTheme } from "@/lib/themeStore";

const meta = {
  christmas: {
    title: "Kalėdinių lempučių montavimas Vilniuje — girliandų kabinimas",
    description: `Kalėdinių lempučių ir girliandų montavimas ant namo stogo, langų, medžių ir tvorų Vilniuje ir apskrityje, nuėmimas po švenčių. Nuo ${formatPrice(pricing.installPerMeter)}/m, nemokama apžiūra.`,
  },
  halloween: {
    title: "Helovyno apšvietimo montavimas ir nuėmimas Vilniuje",
    description:
      "Lauko LED lempučių montavimas ant stogo, langų, medžių ir tvorų Helovynui ir visam sezonui, nuėmimas po sezono. Vilnius ir Vilniaus apskritis. Pasiteiraukite apie nemokamą apžiūrą.",
  },
};

export async function generateMetadata() {
  return pageMetadata({ ...meta[await getSiteTheme()], path: "/montavimas" });
}

const included = [
  {
    icon: Ruler,
    title: "Nemokama apžiūra",
    text: "Atvažiuojame, išmatuojame ir pasakome tikslią kainą. Jokių įsipareigojimų.",
  },
  {
    icon: Lightbulb,
    title: "Aukščiausios kokybės lemputės",
    text: "Šiltai baltas XP ir LLinks lauko LED girliandas galite pirkti arba išsinuomoti. Galime naudoti ir jūsų turimas lemputes.",
  },
  {
    icon: ShieldCheck,
    title: "Saugus tvirtinimas",
    text: "Specialūs laikikliai — jokių skylių ir žymių ant stogo, latakų ar sienų.",
  },
  {
    icon: Clock,
    title: "Pasiūlymas jūsų objektui",
    text: "Suderiname apšvietimo ilgį, lempučių pasirinkimą ir galutinę darbo kainą.",
  },
  {
    icon: RotateCcw,
    title: "Nuėmimas po švenčių",
    text: "Sausį viską nuimame. Nuomotas lemputes išsivežame, pirktas supakuojame jums.",
  },
];

const halloweenIncluded: typeof included = [
  {
    ...included[0],
    text: "Atvažiuojame, išmatuojame ir pasakome tikslią kainą. Jokių įsipareigojimų — ir jokių triukų.",
  },
  {
    ...included[1],
    text: "Šiltai baltas XP ir LLinks lauko LED girliandas galite pirkti arba išsinuomoti. Galime naudoti ir jūsų turimas lemputes — net spalvotas Helovyno.",
  },
  {
    ...included[2],
    text: "Specialūs laikikliai — jokių skylių ir žymių ant stogo, latakų ar sienų. Pėdsakų nepaliekame, kaip tikri vaiduokliai.",
  },
  included[3],
  {
    ...included[4],
    title: "Nuėmimas po sezono",
    text: "Po sezono viską nuimame. Nuomotas lemputes išsivežame, pirktas supakuojame jums — iki kito Helovyno ar Kalėdų.",
  },
];

const copy = {
  christmas: {
    title: "Kalėdinių lempučių montavimas Vilniuje",
    text: "Kalėdinių lempučių ir girliandų kabinimas ant namo stogo, langų, terasų, medžių ir tvorų. Papuošiame jūsų namus pirktomis ar išnuomotomis lemputėmis, o po švenčių viską nuimame — jums nereikės nei kopėčių, nei laiko, nei vietos joms laikyti.",
    includedTitle: "Jūs tik pasirenkate — visa kita padarome mes",
    included,
    serviceArea: "Kalėdines lemputes montuojame ir nuimame",
  },
  halloween: {
    title: "Helovyno apšvietimo montavimas ir nuėmimas",
    text: "Atvažiuojame ir papuošiame jūsų namus pirktomis ar išnuomotomis lemputėmis, o po sezono viską nuimame. Jums nereikės nei kopėčių tamsoje, nei laiko, nei vietos joms laikyti.",
    includedTitle: "Jūs renkatės kostiumą — visa kita padarome mes",
    included: halloweenIncluded,
    serviceArea: "Helovyno ir šventinį apšvietimą montuojame ir nuimame",
  },
};

export default async function InstallationPage() {
  const theme = await getSiteTheme();
  const t = copy[theme];
  return (
    <>
      <JsonLd
        data={[
          businessSchema(),
          installationServiceSchema(),
          breadcrumbSchema([
            { name: "Pradžia", path: "/" },
            { name: "Montavimas", path: "/montavimas" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Pagrindinė paslauga"
        title={t.title}
        text={t.text}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="#forma" className="btn btn-primary">
            Užsakyti nemokamą apžiūrą
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <a href={phoneHref} className="btn btn-outline">
            <Phone className="size-4" aria-hidden="true" />
            {site.phone}
          </a>
        </div>
      </PageHeader>

      <section className="container-page grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
        <div className={clsx("relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:aspect-[4/5]", theme === "halloween" && "hw-night hw-web")}>
          <Image
            src="/work/lithuanian-house-xp-red-brick.png"
            alt="Mūrinis namas su šiltai baltomis LED girliandomis palei stogo kraštus ir balkoną"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading
            eyebrow="Kas įskaičiuota"
            title={t.includedTitle}
          />
          <ul className="mt-10 space-y-7">
            {t.included.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-glow-soft">
                  <Icon className="size-6 text-glow-deep" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-sans text-lg font-bold text-pine-900">
                    {title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-stone">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page pb-10">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl bg-pine-900 p-7 text-snow">
            <h2 className="text-2xl font-semibold">Su mūsų lemputėmis</h2>
            <p className="mt-3 font-display text-4xl">
              {formatPrice(pricing.installPerMeter)} / m
            </p>
            <p className="mt-3 text-snow/75">
              Kabinimas ir nuėmimas po sezono. Lempučių nuoma arba pirkimas
              skaičiuojami atskirai.
            </p>
          </div>
          <div className="rounded-3xl bg-cream p-7 text-pine-900">
            <h2 className="text-2xl font-semibold">Su jūsų lemputėmis</h2>
            <p className="mt-3 font-display text-4xl">
              {formatPrice(pricing.clientLightsPerMeter)} / m
            </p>
            <p className="mt-3 text-stone">
              Kabinimas ir nuėmimas po sezono. Prieš darbus suderiname lempučių
              ir objekto sąlygas.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone">
            Standartiniai darbo tarifai. Galutinė kaina priklauso nuo konkretaus
            projekto ir suderinama pasiūlyme.
          </p>
          <Link href="/kiek-kainuoja" className="btn btn-dark shrink-0">
            <Calculator className="size-4" aria-hidden="true" />
            Apskaičiuoti savo namo kainą
          </Link>
        </div>
      </section>
      <DecorAreas />
      <ServiceGuide guide={installationGuide} />
      <SeasonSteps />
      <FAQ faqs={theme === "halloween" ? [...halloweenFaqs.slice(0, 3), ...installationFaqs] : installationFaqs} />
      <ServiceArea what={t.serviceArea} />
      <ContactSection defaultServices={[INSTALLATION_SERVICE]} />
    </>
  );
}
