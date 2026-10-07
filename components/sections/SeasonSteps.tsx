import { seasonSteps } from "@/lib/data/services";
import { Bulb } from "../Lights";
import SectionHeading from "../ui/SectionHeading";

const bulbColors = ["#f4b03e", "#e5483d", "#3fa36b", "#4d8fe0"];

export default function SeasonSteps() {
  return (
    <section id="kaip-tai-veikia" className="bg-cream py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Kaip tai veikia"
          title="Visas sezonas be jokio vargo"
          text="Keturi paprasti žingsniai — nuo pirmo skambučio iki lempučių nuėmimo."
        />

        <div className="relative mt-14">
          {/* The wire the step bulbs hang from (desktop) */}
          <svg
            className="absolute inset-x-0 top-0 hidden h-6 w-full lg:block"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 1 Q6.25 6 12.5 1 Q25 9 37.5 1 Q50 9 62.5 1 Q75 9 87.5 1 Q93.75 6 100 1"
              fill="none"
              stroke="#1a3b2c"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="grid gap-5 lg:grid-cols-4 lg:gap-0">
            {seasonSteps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-5 rounded-3xl bg-white p-6 lg:flex-col lg:items-center lg:bg-transparent lg:px-3 lg:py-0 lg:text-center"
              >
                <Bulb id={`step-bulb-${i}`} color={bulbColors[i]} className="h-16 w-12 shrink-0 lg:h-20 lg:w-14" />
                <div>
                  <p className="text-xs font-extrabold tracking-widest text-glow-deep uppercase">
                    {i + 1}. {step.when}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-pine-900">{step.title}</h3>
                  {step.text && (
                    <p className="mt-2 leading-relaxed text-stone lg:mx-auto lg:max-w-[16rem]">{step.text}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
