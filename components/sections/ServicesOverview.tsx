import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pricing } from "@/lib/data/pricing";
import { formatPrice } from "@/lib/format";
import SectionHeading from "../ui/SectionHeading";

export default function ServicesOverview() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading
        eyebrow="Vilnius ir Vilniaus apskritis"
        title="Kalėdinis apšvietimas namams ir įmonėms"
        text="Puošiame stogo kraštus, įėjimus, vitrinas, terasas ir kieme augančius medžius. Pasirinkite montavimą, girliandų nuomą sezonui arba lempučių pirkimą."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          { href: "/montavimas", title: "Kalėdinių lempučių montavimas", text: `Atvykstame su girliandomis arba pakabiname jūsų turimas. Darbas su mūsų lemputėmis nuo ${formatPrice(pricing.installPerMeter)}/m; lempučių kaina atskirai. Tvirtinimą ir elektros prijungimą suderiname pagal objektą.`, label: "Montavimo eiga ir kaina" },
          { href: "/nuoma", title: "Girliandų nuoma sezonui", text: "XP arba komercinės klasės LLinks lauko girliandas išnuomojame sutartam šventiniam laikotarpiui. Nuomą ir darbus įvertiname atskirai, o po sezono lemputes pasiimame.", label: "Lempučių nuomos sąlygos" },
          { href: "/kaledines-lemputes", title: "Lauko LED girliandų pardavimas", text: "Šiltai baltos XP ir LLinks girliandos 7,5 m sekcijomis bei 45 m ir 60 m komplektais. Tos pačios serijos sekcijos jungiamos tarpusavyje; įsigytoms lemputėms suteikiame 2 metų garantiją.", label: "Rinktis lauko girliandas" },
        ].map((item) => (
          <article key={item.href} className="flex flex-col rounded-3xl border border-sand bg-white p-7">
            <h3 className="text-2xl font-semibold text-pine-900">{item.title}</h3>
            <p className="mt-4 leading-relaxed text-stone">{item.text}</p>
            <Link href={item.href} className="mt-auto inline-flex items-center gap-2 pt-6 font-bold text-pine-900 hover:text-glow-deep">{item.label}<ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link>
          </article>
        ))}
      </div>
    </section>
  );
}
