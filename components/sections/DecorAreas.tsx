import { AppWindow, Castle, Fence, House, Sofa, TreeDeciduous, TreePine, Warehouse } from "lucide-react";
import { decorAreas, halloweenDecorAreas } from "@/lib/data/services";
import { getSiteTheme } from "@/lib/themeStore";
import SectionHeading from "../ui/SectionHeading";

const icons = { roof: House, window: AppWindow, terrace: Sofa, tree: TreePine, fence: Fence, estate: Warehouse };
const halloweenIcons = { ...icons, tree: TreeDeciduous, estate: Castle };

const copy = {
  christmas: {
    title: "Nuo stogo krašto iki kiemo eglutės",
    text: "Kalėdinėmis lemputėmis papuošiame visą namą ir jo aplinką — jūs pasirenkate, ką apšviesti.",
  },
  halloween: {
    title: "Nuo stogo krašto iki kiemo medžio",
    text: "Lemputėmis apšviečiame visą namą ir jo aplinką — jūs pasirenkate, ką paversti Helovyno scena.",
  },
};

export default async function DecorAreas() {
  const theme = await getSiteTheme();
  const halloween = theme === "halloween";
  const t = copy[theme];
  const areas = halloween
    ? decorAreas.map((area) => ({ ...area, ...halloweenDecorAreas[area.icon] }))
    : decorAreas;
  return (
    <section className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Ką papuošiame"
        title={t.title}
        text={t.text}
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => {
          const Icon = (halloween ? halloweenIcons : icons)[area.icon];
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
