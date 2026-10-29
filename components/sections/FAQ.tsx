import { Phone, Plus } from "lucide-react";
import { faqs as defaultFaqs, halloweenFaqs } from "@/lib/data/services";
import { faqSchema } from "@/lib/seo";
import { phoneHref, site } from "@/lib/site";
import { getSiteTheme } from "@/lib/themeStore";
import JsonLd from "../JsonLd";
import SocialIcon from "../SocialIcon";
import SectionHeading from "../ui/SectionHeading";

const copy = {
  christmas: {
    title: "Turite klausimų?",
    text: "Neradote atsakymo? Paskambinkite arba parašykite per WhatsApp — mielai viską paaiškinsime.",
    faqs: defaultFaqs,
  },
  halloween: {
    title: "Klausimų, nuo kurių šiurpsta oda?",
    text: "Neradote atsakymo? Paskambinkite arba parašykite per WhatsApp — nekandame, net per Helovyną.",
    faqs: halloweenFaqs,
  },
};

export default async function FAQ({
  faqs,
  title,
}: {
  faqs?: { q: string; a: string }[];
  title?: string;
}) {
  const t = copy[await getSiteTheme()];
  return (
    <section id="duk" className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      {/* Only a page's own questions are marked up: the shared list repeats on several pages. */}
      {faqs && <JsonLd data={faqSchema(faqs)} />}
      <div>
        <SectionHeading eyebrow="Dažni klausimai" title={title ?? t.title} />
        <p className="mt-4 text-lg text-stone">{t.text}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={phoneHref} className="btn btn-dark">
            <Phone className="size-4" aria-hidden="true" />
            {site.phone}
          </a>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <SocialIcon name="WhatsApp" className="size-4" />
            WhatsApp
          </a>
        </div>
      </div>

      <div className="divide-y divide-sand border-y border-sand">
        {(faqs ?? t.faqs).map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-bold text-pine-900 [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream transition-transform duration-300 group-open:rotate-45 group-open:bg-glow">
                <Plus className="size-4" aria-hidden="true" />
              </span>
            </summary>
            <p className="-mt-1 max-w-2xl pr-12 pb-6 leading-relaxed text-stone">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
