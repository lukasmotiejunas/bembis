import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Lightbulb, Phone, RotateCcw, Ruler, ShieldCheck } from "lucide-react";
import { phoneHref, site } from "@/lib/site";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import SeasonSteps from "@/components/sections/SeasonSteps";
import FAQ from "@/components/sections/FAQ";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Kalėdinių lempučių montavimas ir nuėmimas",
  description:
    "Atvažiuojame, sumontuojame kalėdines lemputes ant jūsų namų, o po švenčių viską nuimame. Nemokama apžiūra ir kainos pasiūlymas.",
};

const included = [
  {
    icon: Ruler,
    title: "Nemokama apžiūra",
    text: "Atvažiuojame, išmatuojame ir pasakome tikslią kainą. Jokių įsipareigojimų.",
  },
  {
    icon: Lightbulb,
    title: "Pirktos arba nuomotos lemputės",
    text: "Kokybiškos lauko LED lemputės — jūs renkatės, ar jas pirkti, ar nuomotis.",
  },
  {
    icon: ShieldCheck,
    title: "Saugus tvirtinimas",
    text: "Specialūs laikikliai — jokių skylių ir žymių ant stogo, latakų ar sienų.",
  },
  {
    icon: Clock,
    title: "Laikmačio nustatymas",
    text: "Lemputės pačios įsijungs vakare ir išsijungs naktį.",
  },
  {
    icon: RotateCcw,
    title: "Nuėmimas po švenčių",
    text: "Sausį viską nuimame. Nuomotas lemputes išsivežame, pirktas supakuojame jums.",
  },
];

export default function InstallationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pagrindinė paslauga"
        title="Montavimas ir nuėmimas"
        text="Atvažiuojame ir papuošiame jūsų namus pirktomis ar išnuomotomis lemputėmis, o po švenčių viską nuimame. Jums nereikia nei kopėčių, nei laiko, nei vietos sandėliuoti."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="#forma" className="btn btn-primary">
            Užsakyti nemokamą apžiūrą
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <a href={phoneHref} className="btn btn-outline">
            <Phone className="size-4" aria-hidden="true" />
            {site.phone}
          </a>
        </div>
      </PageHeader>

      <section className="container-page grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:aspect-[4/5]">
          <Image
            src="/work/warm-cabin.jpg"
            alt="Namas su kalėdinėmis lemputėmis ant stogo ir medžių"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading eyebrow="Kas įskaičiuota" title="Jūs tik pasirenkate — visa kita padarome mes" />
          <ul className="mt-10 space-y-7">
            {included.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-glow-soft">
                  <Icon className="size-6 text-glow-deep" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-sans text-lg font-bold text-pine-900">{title}</h3>
                  <p className="mt-1 leading-relaxed text-stone">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SeasonSteps />
      <FAQ />
      <ContactSection defaultServices={["Montavimas", "Nuėmimas po švenčių"]} />
    </>
  );
}
