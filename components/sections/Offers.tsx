import Link from "next/link";
import { ArrowRight, Check, House, Repeat, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { lowestPrice, lowestRentPrice } from "@/lib/data/products";
import SectionHeading from "../ui/SectionHeading";

const small = [
  {
    href: "/shop",
    icon: ShoppingBag,
    title: "Pirkite lemputes",
    text: "Kokybiškos lauko LED lemputės, kurios tarnaus daugelį metų.",
    price: `nuo ${formatPrice(lowestPrice)}`,
    cta: "Žiūrėti lemputes",
  },
  {
    href: "/rent",
    icon: Repeat,
    title: "Išsinuomokite sezonui",
    text: "Nereikia nei pirkti, nei sandėliuoti. Po švenčių lemputes pasiimame.",
    price: `nuo ${formatPrice(lowestRentPrice)} / sezonui`,
    cta: "Žiūrėti nuomą",
  },
];

export default function Offers() {
  return (
    <section className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Ką siūlome"
        title="Pasirinkite, kas jums patogiausia"
        text="Lemputes galite pirkti arba išsinuomoti. O jei nenorite vargti — atvažiuosime ir viską padarysime už jus."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Link
          href="/installation"
          className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-pine-900 p-8 text-snow sm:p-10 lg:row-span-2"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-glow/25 blur-3xl" />
          <span className="w-fit rounded-full bg-glow px-3 py-1 text-xs font-extrabold text-pine-950">Pagrindinė paslauga</span>
          <House className="mt-8 size-10 text-glow" aria-hidden="true" />
          <h3 className="mt-5 text-3xl font-semibold sm:text-4xl">Sumontuosime ir nuimsime</h3>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-snow/75">
            Atvažiuosime ir papuošime jūsų namus pirktomis ar išnuomotomis lemputėmis. Po švenčių grįšime ir viską nuimsime.
          </p>
          <ul className="mt-7 space-y-3">
            {["Nemokama apžiūra ir kainos pasiūlymas", "Saugus tvirtinimas be skylių", "Laikmačio nustatymas", "Nuėmimas sausį"].map(
              (f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="size-5 shrink-0 text-glow" aria-hidden="true" />
                  {f}
                </li>
              )
            )}
          </ul>
          <div className="mt-auto pt-10">
            <span className="btn btn-primary">
              Apie montavimą
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </Link>

        {small.map(({ href, icon: Icon, title, text, price, cta }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col rounded-[2rem] border border-sand bg-white p-8 transition hover:border-pine-900/25 hover:shadow-[0_24px_48px_-28px_rgb(18_42_31/0.35)] sm:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-glow-soft">
                <Icon className="size-6 text-glow-deep" aria-hidden="true" />
              </div>
              <span className="text-right text-sm font-bold text-pine-900">{price}</span>
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-pine-900">{title}</h3>
            <p className="mt-2 leading-relaxed text-stone">{text}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-pine-900">
              {cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
