import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, CalendarDays, RotateCcw, Truck } from "lucide-react";
import { products } from "@/lib/data/products";
import { PurchaseMode } from "@/lib/types";
import PageHeader from "../ui/PageHeader";
import ProductCard from "./ProductCard";

const copy: Record<PurchaseMode, { eyebrow: string; title: string; text: string }> = {
  buy: {
    eyebrow: "Lemputės",
    title: "Kalėdinės lemputės jūsų namams",
    text: "Kokybiškos lauko LED lemputės, kurios tarnaus daugelį sezonų. Galite jas pirkti arba išsinuomoti.",
  },
  rent: {
    eyebrow: "Nuoma",
    title: "Išsinuomokite lemputes sezonui",
    text: "Visos šventės su lemputėmis — be pirkimo ir sandėliavimo. Po švenčių jas pasiimame.",
  },
};

const rentPerks = [
  { icon: CalendarDays, text: "Nuoma visam sezonui — nuo lapkričio iki sausio" },
  { icon: RotateCcw, text: "Po švenčių lemputes pasiimame" },
  { icon: Truck, text: "Su montavimu — dar paprasčiau" },
];

function ModeToggle({ mode }: { mode: PurchaseMode }) {
  const tabs = [
    { mode: "buy" as const, href: "/shop", label: "Pirkti" },
    { mode: "rent" as const, href: "/rent", label: "Nuomotis sezonui" },
  ];
  return (
    <nav className="inline-flex rounded-full border-[1.5px] border-sand bg-white p-1" aria-label="Pirkti ar nuomotis">
      {tabs.map((t) => (
        <Link
          key={t.mode}
          href={t.href}
          aria-current={mode === t.mode ? "page" : undefined}
          className={clsx(
            "rounded-full px-5 py-2.5 text-sm font-bold transition-colors sm:px-6",
            mode === t.mode ? "bg-pine-900 text-snow" : "text-stone hover:text-pine-900"
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Catalog({ mode }: { mode: PurchaseMode }) {
  const c = copy[mode];

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} text={c.text}>
        <ModeToggle mode={mode} />
      </PageHeader>

      <section className="container-page py-14 sm:py-20">
        {mode === "rent" && (
          <ul className="mb-10 grid gap-3 sm:grid-cols-3">
            {rentPerks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 rounded-2xl bg-glow-soft px-5 py-4 font-semibold text-pine-900">
                <Icon className="size-5 shrink-0 text-glow-deep" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} mode={mode} />
          ))}
        </div>

        <Link
          href="/installation"
          className="group mt-14 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-pine-900 p-8 text-snow sm:flex-row sm:items-center sm:p-10"
        >
          <div>
            <p className="font-display text-2xl font-semibold sm:text-3xl">Nenorite lipti ant kopėčių?</p>
            <p className="mt-2 max-w-xl text-snow/70">
              Atvažiuosime ir sumontuosime lemputes, o po švenčių — viską nuimsime.
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
