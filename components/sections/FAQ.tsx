import { Phone, Plus } from "lucide-react";
import { faqs as defaultFaqs } from "@/lib/data/services";
import { phoneHref, site } from "@/lib/site";
import SectionHeading from "../ui/SectionHeading";

export default function FAQ({
  faqs = defaultFaqs,
  title = "Turite klausimų?",
}: {
  faqs?: { q: string; a: string }[];
  title?: string;
}) {
  return (
    <section id="duk" className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div>
        <SectionHeading eyebrow="Dažni klausimai" title={title} />
        <p className="mt-4 text-lg text-stone">Neradote atsakymo? Paskambinkite — mielai viską paaiškinsime.</p>
        <a href={phoneHref} className="btn btn-dark mt-6">
          <Phone className="size-4" aria-hidden="true" />
          {site.phone}
        </a>
      </div>

      <div className="divide-y divide-sand border-y border-sand">
        {faqs.map((f) => (
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
