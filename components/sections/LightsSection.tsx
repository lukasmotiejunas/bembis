import Link from "next/link";
import clsx from "clsx";
import { ShieldCheck, Layers, Lightbulb } from "lucide-react";
import { products } from "@/lib/data/products";
import ProductFeatureCard from "../shop/ProductFeatureCard";
import SectionHeading from "../ui/SectionHeading";

export const qualityPoints = [
  {
    icon: ShieldCheck,
    title: "2 metų garantija",
    text: "Dėl lempučių gedimo kreipkitės į mus.",
  },
  {
    icon: Layers,
    title: "Modulinės girliandos",
    text: "7,5 m motininės ir papildomos sekcijos arba 45 m ir 60 m komplektai.",
  },
  {
    icon: Lightbulb,
    title: "Šiltai baltas LED",
    text: "XP ir komercinės klasės LLinks lauko apšvietimas.",
  },
];
export function QualityPoints({
  onCream = false,
}: {
  withHeading?: boolean;
  onCream?: boolean;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {qualityPoints.map(({ icon: Icon, title, text }) => (
        <li
          key={title}
          className={clsx(
            "flex gap-4 rounded-3xl p-6",
            onCream ? "bg-white" : "bg-cream",
          )}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-glow-soft">
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
export default function LightsSection({
  withHeading = true,
}: {
  withHeading?: boolean;
}) {
  const shown = withHeading
    ? products.filter((p) => p.kind === "bundle" && p.sections === 6)
    : products;
  return (
    <section
      className={
        withHeading
          ? "container-page py-20 sm:py-28"
          : "container-page py-14 sm:py-20"
      }
    >
      {withHeading && (
        <div className="mb-10">
          <SectionHeading
            eyebrow="Lempučių pardavimas"
            title="Girliandos, kurios lieka jums"
            text="Pasirinkite XP arba LLinks. Pradėkite nuo motininės girliandos, papildykite sekcijomis arba įsigykite visą komplektą."
          />
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        {shown.map((p) => (
          <ProductFeatureCard key={p.id} product={p} />
        ))}
      </div>
      {withHeading && (
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/kaledines-lemputes" className="btn btn-dark">
            Visos girliandos ir komplektai
          </Link>
          <Link href="/nuoma" className="btn btn-outline">
            Nuomos pasirinkimai
          </Link>
        </div>
      )}
      <div className="mt-6">
        <QualityPoints />
      </div>
    </section>
  );
}
