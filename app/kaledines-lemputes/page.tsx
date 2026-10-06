import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuaranteeBadge } from "@/components/Guarantee";
import JsonLd from "@/components/JsonLd";
import LightsSection from "@/components/sections/LightsSection";
import PageHeader from "@/components/ui/PageHeader";
import { breadcrumbSchema, catalogSchema, pageMetadata } from "@/lib/seo";

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
      </PageHeader>

      <LightsSection withHeading={false} />

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
