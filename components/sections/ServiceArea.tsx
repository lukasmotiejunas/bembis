import { MapPin } from "lucide-react";
import { site } from "@/lib/site";

/** Where we work — a short, readable list of towns (also helps local search). */
export default function ServiceArea({ what }: { what: string }) {
  return (
    <section className="container-page pb-20 sm:pb-28">
      <div className="rounded-[2rem] bg-cream p-8 sm:p-10">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white">
            <MapPin className="size-6 text-glow-deep" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold text-pine-900 sm:text-3xl">Kur dirbame</h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-stone">
              {what} — Vilniuje ir visoje Vilniaus apskrityje. Gyvenate kitur? Paskambinkite, pažiūrėsime, ką galime padaryti.
            </p>
          </div>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Miestai, kuriuose dirbame">
          {site.serviceTowns.map((town) => (
            <li key={town} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-pine-900">
              {town}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
