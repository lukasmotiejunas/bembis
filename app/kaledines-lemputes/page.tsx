import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuaranteeBadge } from "@/components/Guarantee";
import JsonLd from "@/components/JsonLd";
import LightsSection from "@/components/sections/LightsSection";
import LightSetBuilder from "@/components/shop/LightSetBuilder";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { breadcrumbSchema, catalogSchema, pageMetadata } from "@/lib/seo";
import { paymentTestEnabled, paymentTestProduct } from "@/lib/orders/payment-test";

export const metadata = pageMetadata({
  title: "XP ir LLinks lauko LED girliandos ir komplektai",
  description:
    "Šiltai baltos XP ir LLinks lauko LED girliandos: 7,5 m motininės ir papildomos sekcijos, 45 m ir 60 m komplektai. Sudėtis, pardavimo kainos ir nuomos pasirinkimai.",
  path: "/kaledines-lemputes",
});

export default function ShopPage() {
  return (
    <>
      <JsonLd
        data={[
          catalogSchema(),
          breadcrumbSchema([
            { name: "Pradžia", path: "/" },
            { name: "Kalėdinės lemputės", path: "/kaledines-lemputes" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Lempučių ir komplektų katalogas"
        title="Šiltai baltos lauko LED girliandos"
        text="XP ir komercinės klasės LLinks: 7,5 m motininės girliandos, papildomos sekcijos bei 45 m ir 60 m komplektai. Pardavimo kainos nurodytos už vienetą arba visą komplektą."
      >
        <GuaranteeBadge dark className="px-4 py-2 text-sm" />
        <div className="mt-10">
          <LightSetBuilder />
        </div>
      </PageHeader>

      <section id="katalogas" className="container-page scroll-mt-28 pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Visas katalogas"
          title="Arba išsirinkite patys"
          text="Motininės girliandos, papildomos sekcijos ir komplektai atskirai — sudėkite krepšelį savo nuožiūra."
        />
      </section>
      <LightsSection withHeading={false} />

      {paymentTestEnabled() && (
        <section className="container-page pb-12">
          <div className="rounded-[2rem] border border-sand bg-cream p-6 sm:p-8">
            <p className="eyebrow">Laikinas produktas · 1,00 €</p>
            <h2 className="mt-2 text-2xl font-semibold text-pine-900">{paymentTestProduct.name}</h2>
            <p className="mt-3 text-stone">{paymentTestProduct.description}</p>
            <Link href="/mokejimo-patikra" className="btn btn-dark mt-5">Patikrinti mokėjimą už 1,00 €</Link>
          </div>
        </section>
      )}

      <section className="container-page pb-20 sm:pb-28">
        <Link
          href="/montavimas"
          className="group flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-pine-900 p-8 text-snow sm:flex-row sm:items-center sm:p-10"
        >
          <div>
            <p className="font-display text-2xl font-semibold sm:text-3xl">
              Nenorite lipti ant kopėčių?
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
