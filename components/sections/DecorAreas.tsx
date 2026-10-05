import { AppWindow, Fence, House, Sofa, TreePine, Warehouse } from "lucide-react";
import { decorAreas } from "@/lib/data/services";
import SectionHeading from "../ui/SectionHeading";

const icons = { roof: House, window: AppWindow, terrace: Sofa, tree: TreePine, fence: Fence, estate: Warehouse };

export default function DecorAreas() {
  return (
    <section className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Ką papuošiame"
        title="Nuo stogo krašto iki kiemo eglutės"
        text="Kalėdinėmis lemputėmis papuošiame visą namą ir jo aplinką — jūs pasirenkate, ką apšviesti."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {decorAreas.map((area) => {
          const Icon = icons[area.icon];
          return (
            <li key={area.title} className="flex gap-4 rounded-3xl border border-sand bg-white p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-glow-soft">
                <Icon className="size-6 text-glow-deep" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-sans text-lg font-bold text-pine-900">{area.title}</h3>
                <p className="mt-1 leading-relaxed text-stone">{area.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
