"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Kiek tiksli AI vizualizacija?",
    a: "Mūsų AI išsaugo jūsų namo architektūrą, proporcijas, langus, stogą ir aplinką. Pridedamos tik Kalėdinės lemputės ir puošybos elementai, nekeičiant struktūros. Rezultatas paprastai 85–95% atitinka galutinį montavimą.",
  },
  {
    q: "Ar aptarnaujate mano miestą?",
    a: "Šiuo metu aptarnaujame Vilnių ir Vilniaus apskritį. Plečiamės — susisiekite, jei esate kitame mieste, ir pažiūrėsime, ką galėsime padaryti.",
  },
  {
    q: "Kiek iš anksto reikia rezervuoti?",
    a: "Piko sezono metu (lapkritis–gruodis) rekomenduojame rezervuoti 3–4 savaites iš anksto. Spalio pradžioje rezervavę klientai gauna 10% nuolaidą.",
  },
  {
    q: "Ar montavimas saugus mano namams?",
    a: "Absoliučiai. Naudojame specializuotus lauko kablių tvirtinimo elementus, kurie nepalieka žymių ant stogo, latakų ar sienų. Sumontuota šimtuose namų be nė vieno incidento.",
  },
  {
    q: "Kas nutinka po Kalėdų?",
    a: "Siūlome lempučių nuėmimo paslaugą sausio mėnesį — mūsų komanda atvyksta ir nuima visas lemputes bei tvirtinimo elementus. Arba galite pasilikti viską ir kitąmet montuoti pats.",
  },
  {
    q: "Ar po montavimo lemputės lieka man?",
    a: "Taip. Visos naudotos lemputės priklauso jums. Tai aukštos kokybės komercinės klasės LED, kurios tarnaus daugelį sezonų.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-[#08091a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-[#C9A227] text-sm font-semibold uppercase tracking-widest mb-3">
            D.U.K.
          </p>
          <h2 className="section-title text-4xl font-display font-bold text-[#FFF5E6]">
            Dažni klausimai
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border transition-all duration-200 overflow-hidden"
              style={{
                background:
                  open === i ? "rgba(19,28,53,0.9)" : "rgba(13,18,48,0.6)",
                borderColor:
                  open === i ? "rgba(201,162,39,0.35)" : "rgba(30,45,82,0.8)",
              }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-[#FFF5E6] text-sm">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C9A227] shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-[#C4A882] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
