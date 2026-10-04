import clsx from "clsx";
import { ShieldCheck, Snowflake, Zap } from "lucide-react";
import { productFor } from "@/lib/data/products";
import { GuaranteeSeal } from "../Guarantee";
import ProductFeatureCard from "../shop/ProductFeatureCard";
import SectionHeading from "../ui/SectionHeading";

export const qualityPoints = [
  { icon: ShieldCheck, title: "2 metų garantija", text: "Jei sezono metu lemputė sugestų — pakeisime ją nemokamai." },
  { icon: Snowflake, title: "Pritaikytos žiemai", text: "Nebijo lietaus, sniego ir šalčio — sukurtos lauko sąlygoms." },
  { icon: Zap, title: "Ilgaamžės LED", text: "Tarnauja dešimtis tūkstančių valandų ir taupo elektrą." },
];

export function QualityPoints({ onCream = false }: { onCream?: boolean }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {qualityPoints.map(({ icon: Icon, title, text }) => (
        <li key={title} className={clsx("flex gap-4 rounded-3xl p-6", onCream ? "bg-white" : "bg-cream")}>
          <span className={clsx("flex size-11 shrink-0 items-center justify-center rounded-2xl", onCream ? "bg-cream" : "bg-white")}>
            <Icon className="size-5 text-glow-deep" aria-hidden="true" />
          </span>
          <div>
            <p className="font-bold text-pine-900">{title}</p>
            <p className="mt-1 text-sm leading-relaxed text-stone">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The two lights we offer: one to buy, one to rent. */
export default function LightsSection({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section className={withHeading ? "container-page py-20 sm:py-28" : "container-page py-14 sm:py-20"}>
      {withHeading && (
        <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Mūsų lemputės"
            title="Tik aukščiausios kokybės lemputės"
            text="Dvi kruopščiai atrinktos lemputės: vieną galite pirkti, kitą — išsinuomoti sezonui. Abiem suteikiame 2 metų garantiją."
          />
          <GuaranteeSeal className="hidden sm:flex" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductFeatureCard product={productFor("buy")} />
        <ProductFeatureCard product={productFor("rent")} />
      </div>

      <div className="mt-6">
        <QualityPoints />
      </div>
    </section>
  );
}
