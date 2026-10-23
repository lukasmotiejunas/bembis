import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceGuide as Guide } from "@/lib/data/services";
import SectionHeading from "../ui/SectionHeading";

/**
 * A service explained in plain words, under the headings people search for.
 * Shown in every design, so the page keeps its search wording while the Halloween design is on.
 */
export default function ServiceGuide({ guide }: { guide: Guide }) {
  return (
    <section className="container-page py-20 sm:py-28">
      <SectionHeading eyebrow={guide.eyebrow} title={guide.title} text={guide.text} />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {guide.topics.map((topic) => (
          <article key={topic.title} className="flex flex-col rounded-3xl border border-sand bg-white p-7 sm:p-8">
            <h3 className="font-sans text-xl font-bold tracking-normal text-pine-900">{topic.title}</h3>
            <p className="mt-3 leading-relaxed text-stone">{topic.text}</p>
            {topic.link && (
              <Link
                href={topic.link.href}
                className="group mt-auto inline-flex items-center gap-2 pt-5 font-bold text-pine-900 hover:text-glow-deep"
              >
                {topic.link.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
