import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuaranteeBadge } from "@/components/Guarantee";
import JsonLd from "@/components/JsonLd";
import LightsSection from "@/components/sections/LightsSection";
import PageHeader from "@/components/ui/PageHeader";
import { productFor } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kalėdinės lemputės lauko namams — pirkimas ir nuoma",
  description: `Aukščiausios kokybės lauko kalėdinės lemputės su 2 metų garantija: šiltos baltos C9 pirkimui (${formatPrice(productFor("buy").price)}) ir spalvotos C9 nuomai (${formatPrice(productFor("rent").price)} sezonui).`,
  path: "/kaledines-lemputes",
});

export default function ShopPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Pradžia", path: "/" },
          { name: "Kalėdinės lemputės", path: "/kaledines-lemputes" },
        ])}
      />
      <PageHeader
        eyebrow="Dekoracijos"
        title="Aukščiausios kokybės kalėdinės lemputės"
        text="Turime dvi kruopščiai atrinktas lemputes: šiltas baltas — pirkti, spalvotas — išsinuomoti visam sezonui."
      >
        <GuaranteeBadge dark className="px-4 py-2 text-sm" />
      </PageHeader>

      <LightsSection withHeading={false} />

      <section className="container-page pb-20 sm:pb-28">
        <Link
          href="/montavimas"
          className="group flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-pine-900 p-8 text-snow sm:flex-row sm:items-center sm:p-10"
        >
          <div>
            <p className="font-display text-2xl font-semibold sm:text-3xl">Nenorite lipti ant kopėčių?</p>
            <p className="mt-2 max-w-xl text-snow/70">
              Atvažiuosime ir sumontuosime lemputes, o po švenčių — viską nuimsime. Pasirinksite apmokėdami.
            </p>
          </div>
          <span className="btn btn-primary shrink-0">
            Apie montavimą
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
      </section>
    </>
  );
}
