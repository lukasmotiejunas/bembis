import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { GuaranteeBadge } from "@/components/Guarantee";
import JsonLd from "@/components/JsonLd";
import LightsSection from "@/components/sections/LightsSection";
import LightSetBuilder from "@/components/shop/LightSetBuilder";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { breadcrumbSchema, catalogSchema, pageMetadata } from "@/lib/seo";
import { getSiteTheme } from "@/lib/themeStore";
import { products } from "@/lib/data/products";

const meta = {
  christmas: {
    title: "Lauko LED girliandos, komplektai ir Helovyno dekoracijos",
    description:
      "XP ir LLinks lauko LED girliandos, komplektai bei Helovyno dekoracijos: vorai, vaiduokliai, moliūgai ir rinkiniai. Prekes pristatome visoje Lietuvoje.",
  },
  halloween: {
    title: "Lauko LED girliandos ir Helovyno dekoracijos",
    description:
      "Lauko LED girliandos Helovynui ir Kalėdoms bei vorai, vaiduokliai, moliūgai ir kitos Helovyno dekoracijos. Prekes pristatome visoje Lietuvoje.",
  },
};

export async function generateMetadata() {
  return pageMetadata({ ...meta[await getSiteTheme()], path: "/kaledines-lemputes" });
}

const copy = {
  christmas: {
    eyebrow: "Girliandų ir dekoracijų parduotuvė",
    title: "Lauko LED girliandos ir Helovyno dekoracijos",
    text: "Parduodame XP ir komercinės klasės LLinks girliandas: 7,5 m motinines ir papildomas sekcijas bei 45 m ir 60 m komplektus. Taip pat rasite vorus, vaiduoklius, moliūgus ir kitas Helovyno dekoracijas savo namams. Prekes pristatome visoje Lietuvoje.",
    catalogTitle: "Arba išsirinkite patys",
    catalogText: "Motininės girliandos, papildomos sekcijos, komplektai ir Helovyno dekoracijos — sudėkite krepšelį savo nuožiūra.",
    ctaTitle: "Nenorite lipti ant kopėčių?",
  },
  halloween: {
    eyebrow: "Girliandų ir dekoracijų parduotuvė",
    title: "Lauko LED girliandos ir Helovyno dekoracijos",
    text: "Parduodame XP ir komercinės klasės LLinks girliandas, kurios švies per Helovyną, Kalėdas ir visą tamsųjį sezoną. Taip pat rasite vorus, vaiduoklius, moliūgus ir kitas Helovyno dekoracijas savo namams. Prekes pristatome visoje Lietuvoje.",
    // The page opens straight on the catalog, so its heading is the page title.
    catalogTitle: "Helovyno dekoracijos ir lauko girliandos",
    catalogText: "Vorai, vaiduokliai, moliūgai, rinkiniai ir lauko LED girliandos — sudėkite krepšelį savo nuožiūra.",
    ctaTitle: "Nenorite tamsoje lipti ant kopėčių?",
  },
};

export default async function ShopPage() {
  const theme = await getSiteTheme();
  // Halloween shows only the catalog: no set builder above it, no installation banner below.
  const halloween = theme === "halloween";
  const t = copy[theme];
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
      {!halloween && (
        <PageHeader
          eyebrow={t.eyebrow}
          title={t.title}
          text={t.text}
        >
          <GuaranteeBadge dark className="px-4 py-2 text-sm" />
          <span className="ml-2 text-sm text-stone">Lauko LED girliandoms</span>
          <div className="mt-10">
            <LightSetBuilder />
          </div>
        </PageHeader>
      )}

      <section
        id="katalogas"
        className={clsx("container-page scroll-mt-28", halloween ? "pt-10 sm:pt-14" : "pt-16 sm:pt-24")}
      >
        <SectionHeading
          as={halloween ? "h1" : "h2"}
          eyebrow="Visas katalogas"
          title={t.catalogTitle}
          text={t.catalogText}
        />
        <p className="mt-4 text-sm text-stone">{products.length} prekės vienoje vietoje. Helovyno dekoracijas pristatome per 4 dienas visoje Lietuvoje.</p>
      </section>
      <LightsSection withHeading={false} />

      {!halloween && (
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
      )}
    </>
  );
}
