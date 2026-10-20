import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuaranteeBadge } from "@/components/Guarantee";
import JsonLd from "@/components/JsonLd";
import LightsSection from "@/components/sections/LightsSection";
import LightSetBuilder from "@/components/shop/LightSetBuilder";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { breadcrumbSchema, catalogSchema, pageMetadata } from "@/lib/seo";
import { getSiteTheme } from "@/lib/themeStore";

const meta = {
  christmas: {
    title: "Kalėdinės dekoracijos, eglutės žaisliukai ir LED girliandos",
    description:
      "Folkloriniai eglutės žaisliukai, advento kalendoriai, kalėdinės dekoracijos, dovanos ir XP bei LLinks lauko LED girliandos. Prekes pristatome visoje Lietuvoje.",
  },
  halloween: {
    title: "Kalėdinės dekoracijos, žaisliukai ir lauko LED girliandos",
    description:
      "Šiltai baltos XP ir LLinks lauko LED girliandos Helovynui ir visam sezonui: 7,5 m motininės ir papildomos sekcijos, 45 m ir 60 m komplektai. Sudėtis, kainos ir nuomos pasirinkimai.",
  },
};

export async function generateMetadata() {
  return pageMetadata({ ...meta[await getSiteTheme()], path: "/kaledines-lemputes" });
}

const copy = {
  christmas: {
    eyebrow: "Kalėdinių prekių parduotuvė",
    title: "Kalėdinės dekoracijos, žaisliukai ir girliandos",
    text: "Folkloriniai eglutės žaisliukai, advento kalendoriai, kalėdinės dekoracijos ir dovanos. Taip pat XP ir komercinės klasės LLinks lauko LED girliandos. Naujas kalėdines prekes pristatome per 4 darbo dienas visoje Lietuvoje.",
    catalogTitle: "Arba išsirinkite patys",
    ctaTitle: "Nenorite lipti ant kopėčių?",
  },
  halloween: {
    eyebrow: "Dekoracijų ir girliandų parduotuvė",
    title: "Kalėdinės dekoracijos, žaisliukai ir girliandos",
    text: "Folkloriniai eglutės žaisliukai, advento kalendoriai, dekoracijos ir dovanos bei XP ir LLinks lauko LED girliandos. Naujas kalėdines prekes pristatome per 4 darbo dienas visoje Lietuvoje.",
    catalogTitle: "Arba išsirinkite patys — be burtų",
    ctaTitle: "Nenorite tamsoje lipti ant kopėčių?",
  },
};

export default async function ShopPage() {
  const t = copy[await getSiteTheme()];
  return (
    <>
      <JsonLd
        data={[
          catalogSchema(),
          breadcrumbSchema([
            { name: "Pradžia", path: "/" },
            { name: "Parduotuvė", path: "/kaledines-lemputes" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        text={t.text}
      >
        <div className="flex flex-wrap items-center gap-3"><GuaranteeBadge dark className="px-4 py-2 text-sm" /><span className="text-sm text-snow/70">XP ir LLinks LED girliandoms</span></div>
        <div className="mt-10">
          <LightSetBuilder />
        </div>
      </PageHeader>

      <section id="katalogas" className="container-page scroll-mt-28 pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Visas katalogas"
          title={t.catalogTitle}
          text="Žaisliukai, advento kalendoriai, dekoracijos, dovanos ir girliandos — visos prekės vienoje vietoje."
        />
      </section>
      <LightsSection withHeading={false} />

      <section className="container-page pb-20 sm:pb-28">
        <Link
          href="/montavimas"
          className="group flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-pine-900 p-8 text-snow sm:flex-row sm:items-center sm:p-10"
        >
          <div>
            <p className="font-display text-2xl font-semibold sm:text-3xl">
              {t.ctaTitle}
            </p>
            <p className="mt-2 max-w-xl text-snow/70">
              Atvažiuosime, papuošime ir sumontuosime, o po sezono viską
              nuimsime. Konkrečiam objektui suderinsime pasiūlymą.
            </p>
          </div>
          <span className="btn btn-primary shrink-0">
            Apie montavimą
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </Link>
      </section>
    </>
  );
}
