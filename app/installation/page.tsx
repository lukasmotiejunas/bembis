import Link from "next/link";
import {
  Upload,
  Sparkles,
  Sliders,
  FileText,
  Home,
  Check,
  Phone,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Įkelkite savo namą",
    desc: "Atsiųskite savo namo fasado nuotrauką. Tinka bet kokia išmaniojo telefono nuotrauka.",
    detail:
      "Jokios specialios įrangos nereikia. Aiški nuotrauka, padaryta saulėtą arba debesuotą dieną, duoda geriausius rezultatus.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Pamatykite Kalėdinę peržiūrą",
    desc: "AI sugeneruoja fotorealistinę peržiūrą, kaip jūsų namas atrodytų papuoštas.",
    detail:
      "Mūsų AI išsaugo jūsų namo architektūrą, langus, stogą ir stilių — prideda tik lemputes.",
  },
  {
    icon: Sliders,
    step: "03",
    title: "Pasirinkite stilių",
    desc: "Reguliuokite spalvas, intensyvumą ir pasirinkite, kurias zonas apšviesti.",
    detail:
      "Pasirinkite iš Klasikinio šilto, Žiemos balto, Auksinės prabangos, Spalvoto ar Minimalaus skandinaviško stilių.",
  },
  {
    icon: FileText,
    step: "04",
    title: "Gaukite kainą",
    desc: "Apskaičiuojame montavimo kainą pagal jūsų dizainą ir namus.",
    detail:
      "Skaidrus kainodara — gaunate išsamų sąrašą prieš prisiimant bet kokius įsipareigojimus.",
  },
  {
    icon: Home,
    step: "05",
    title: "Mes paversime tai realybe",
    desc: "Mūsų profesionali komanda atvyksta ir papuošia jūsų namus tiksliai kaip peržiūroje.",
    detail:
      "Profesionalus tvirtinimas, atsparios oro sąlygoms jungtys, laikmačio nustatymas — visa tai atlieka mūsų komanda.",
  },
];

const packages = [
  {
    name: "Pradedantiesiems",
    price: "Nuo €290",
    desc: "Puikiai tinka mažesniems namams ir butams",
    features: [
      "Stogo kraštų apšvietimas",
      "Įėjimo dekoracija",
      "Profesionalus tvirtinimas",
      "Laikmačio nustatymas",
      "Atsparios oro sąlygoms jungtys",
    ],
    highlight: false,
  },
  {
    name: "Klasikinis",
    price: "Nuo €490",
    desc: "Populiariausias paketas šeimos namams",
    features: [
      "Stogas + Langai",
      "Įėjimo dekoracija",
      "Iki 2 medžių/krūmų",
      "Profesionalus tvirtinimas",
      "Laikmatis + nuotolinis valdymas",
      "Atspari oro sąlygoms instaliacija",
    ],
    highlight: true,
  },
  {
    name: "Grandiozinis",
    price: "Nuo €890",
    desc: "Pilna transformacija išskirtiniams namams",
    features: [
      "Visas stogo kraštų apšvietimas",
      "Visi langai + įėjimas",
      "Medžiai, krūmai ir sodas",
      "Tvoros apšvietimas",
      "Aukščiausios kokybės dekoratyviniai elementai",
      "Išmanioji laikmačio sistema",
      "Individualaus dizaino sesija",
    ],
    highlight: false,
  },
];

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-[#08091a] pt-28">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-[#C9A227] text-sm font-semibold uppercase tracking-widest mb-3">
          Profesionali paslauga
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-[#FFF5E6] mb-6">
          Kalėdinių lempučių <span className="gold-text">montavimas</span>
        </h1>
        <p className="text-[#C4A882] max-w-2xl mx-auto text-xl mb-10">
          Atvykstame į jūsų namus ir profesionaliai sumontuojame gražų Kalėdinį
          apšvietimą — tiksliai kaip parodyta AI vizualizacijoje.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/visualize" className="btn-gold text-base px-10 py-4">
            <Sparkles className="w-5 h-5" />✨ Pradėti su AI peržiūra
          </Link>
          <a
            href="tel:+37060000000"
            className="btn-outline text-base px-8 py-4"
          >
            <Phone className="w-5 h-5" />
            Skambinkite tiesiogiai
          </a>
        </div>
      </div>

      {/* Before/after showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"
              alt="Namas prieš dekoraciją"
              className="w-full aspect-video object-cover"
              style={{ filter: "brightness(0.7) saturate(0.6)" }}
            />
            <div className="absolute bottom-4 left-4">
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-[rgba(0,0,0,0.7)] backdrop-blur-sm border border-white/10">
                Prieš
              </span>
            </div>
          </div>
          <div className="relative">
            <img
              src="/visualizer-preview.png"
              alt="Namas po Kalėdinės dekoracijos"
              className="w-full aspect-video object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(201,162,39,0.1) 0%, transparent 70%)",
              }}
            />
            <div className="absolute bottom-4 right-4">
              <span
                className="px-4 py-2 rounded-full text-sm font-semibold text-yellow-950"
                style={{
                  background: "linear-gradient(135deg, #C9A227, #E8C84A)",
                }}
              >
                Po ✨ Profesionalaus montavimo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="bg-[#0d1230] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-[#FFF5E6] mb-3">
              Kaip tai veikia
            </h2>
            <p className="text-[#C4A882] max-w-xl mx-auto">
              Nuo nuotraukos iki profesionaliai papuošto namo per kelias dienas.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`flex flex-col md:flex-row gap-8 items-center ${isEven ? "" : "md:flex-row-reverse"}`}
                >
                  <div className="flex-1 glass-card p-8">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(201,162,39,0.1)",
                          border: "1px solid rgba(201,162,39,0.2)",
                        }}
                      >
                        <Icon className="w-6 h-6 text-[#C9A227]" />
                      </div>
                      <div>
                        <div className="text-xs text-[#C9A227] font-semibold uppercase tracking-wider mb-1">
                          Žingsnis {step.step}
                        </div>
                        <h3 className="font-display text-xl font-bold text-[#FFF5E6] mb-2">
                          {step.title}
                        </h3>
                        <p className="text-[#C4A882] mb-3">{step.desc}</p>
                        <p className="text-sm text-[#C4A882]/70">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-lg font-bold text-yellow-950 float-animate"
                    style={{
                      background: "linear-gradient(135deg, #C9A227, #E8C84A)",
                      boxShadow: "0 0 30px rgba(201,162,39,0.4)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-[#FFF5E6] mb-3">
              Montavimo paketai
            </h2>
            <p className="text-[#C4A882] max-w-xl mx-auto">
              Pradinės kainos — tiksli kaina nustatoma pagal jūsų namus ir
              pasirinktą dizainą. Gaukite personalizuotą vizualizaciją, kad
              pamatytumėte savo namo įkainį.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-8"
                style={{
                  background: pkg.highlight
                    ? "linear-gradient(135deg, rgba(201,162,39,0.12), rgba(201,162,39,0.06))"
                    : "#131c35",
                  border: pkg.highlight
                    ? "1px solid rgba(201,162,39,0.5)"
                    : "1px solid #1e2d52",
                  boxShadow: pkg.highlight
                    ? "0 0 40px rgba(201,162,39,0.12)"
                    : "none",
                }}
              >
                {pkg.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-yellow-950"
                    style={{
                      background: "linear-gradient(135deg, #C9A227, #E8C84A)",
                    }}
                  >
                    Populiariausias
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-[#FFF5E6] mb-1">
                  {pkg.name}
                </h3>
                <p className="text-2xl font-bold text-[#E8C84A] mb-1">
                  {pkg.price}
                </p>
                <p className="text-sm text-[#C4A882] mb-6">{pkg.desc}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2.5 text-sm text-[#C4A882]"
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(201,162,39,0.15)" }}
                      >
                        <Check className="w-2.5 h-2.5 text-[#C9A227]" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/visualize"
                  className={
                    pkg.highlight
                      ? "btn-gold w-full justify-center py-3"
                      : "btn-outline w-full justify-center py-3"
                  }
                >
                  <Sparkles className="w-4 h-4" />
                  Gauti kainą
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#C4A882]/60 mt-6">
            * Tiksli kaina patvirtinama peržiūrėjus jūsų namo nuotrauką ir
            dizaino pageidavimus
          </p>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-[#FFF5E6] mb-4">
            Pasiruošę transformuoti savo namus?
          </h2>
          <p className="text-[#C4A882] mb-10 text-lg">
            Pradėkite nuo nemokamos AI vizualizacijos — pamatykite savo namus
            papuoštus dar prieš sumontuodami pirmą lemputę.
          </p>
          <Link href="/visualize" className="btn-gold text-lg px-12 py-5">
            <Sparkles className="w-6 h-6" />✨ Pamatyti savo namus Kalėdinių
            lempučių šviesoje
          </Link>
        </div>
      </div>
    </div>
  );
}
