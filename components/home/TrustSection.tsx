"use client";
import { CheckCircle, Star, Shield, Users, Award, Zap } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Profesionalus montavimas",
    desc: "Sertifikuota montavimo komanda su komercinės klasės įranga",
  },
  {
    icon: CheckCircle,
    title: "Lauko klasės apšvietimas",
    desc: "IP65+ vandeniui atsparios lemputės, sukurtos Baltijos žiemoms",
  },
  {
    icon: Shield,
    title: "Saugūs tvirtinimo metodai",
    desc: "Jokios žalos jūsų namams — specializuoti lauko kabliai",
  },
  {
    icon: Zap,
    title: "Individualūs dizainai",
    desc: "Kiekvienas montavimas pritaikomas jūsų namo unikaliai architektūrai",
  },
  {
    icon: Award,
    title: "Skaidrios kainos",
    desc: "Aiški kaina prieš pradedant darbą — jokių paslėptų mokesčių",
  },
  {
    icon: Users,
    title: "Vietinė komanda",
    desc: "Jūsų kaimynai, aptarnaujantys bendruomenę nuo 2021 m.",
  },
];

const reviews = [
  {
    name: "Ramutė K.",
    location: "Vilnius",
    rating: 5,
    text: "AI peržiūra buvo neįtikėtina — mačiau tiksliai, kaip atrodys mano namas, kol dar nepradėjo montuoti. Realus rezultatas buvo dar geresnis nei peržiūra. Tiesiog magija.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    style: "Auksinės prabangos",
  },
  {
    name: "Andrius M.",
    location: "Kaunas",
    rating: 5,
    text: "Buvau skeptiškas dėl AI vizualizacijos, bet ji buvo labai tiksli. Komanda buvo profesionali, greita, o lemputės atrodo nuostabiai. Vaikai buvo sužavėti.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    style: "Klasikinis šiltas",
  },
  {
    name: "Daiva P.",
    location: "Klaipėda",
    rating: 5,
    text: "Geriausios Kalėdinės investicijos gyvenime. Minimalus Skandinaviškas stilius, kurį rekomendavo, puikiai tiko mūsų moderniam namui. Tikrai užsakysime ir kitais metais.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    style: "Minimalus Skandinaviškas",
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-[#0d1230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="section-title text-4xl md:text-5xl font-display font-bold text-[#FFF5E6]">
            Jūsų namai. <span className="gold-text">Mūsų Kalėdinė magija.</span>
          </h2>
          <p className="mt-4 text-[#C4A882] max-w-xl mx-auto">
            Kiekvienus namus traktuojame kaip savus — su rūpesčiu, kompetencija
            ir tikru dėmesiu detalėms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {trustPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={i}
                className="glass-card p-6 group hover:border-[rgba(201,162,39,0.3)] transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(201,162,39,0.1)",
                    border: "1px solid rgba(201,162,39,0.2)",
                  }}
                >
                  <Icon className="w-5 h-5 text-[#C9A227]" />
                </div>
                <h3 className="font-semibold text-[#FFF5E6] mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-[#C4A882] leading-relaxed">
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
