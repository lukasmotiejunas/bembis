import { formatPrice } from "../format";
import { site } from "../site";
import { pricing } from "./pricing";
import { buildEstimate } from "./priceExample";
import { seriesNames } from "./products";

const example = buildEstimate()!;
const exampleLights =
  example.choice === "client"
    ? "jūsų lemputėmis"
    : `${seriesNames[example.choice]} nuoma`;
export const seasonSteps = [
  {
    when: "Prieš sezoną",
    title: "Susisiekiate",
    text: "Paskambinkite arba parašykite. Aptariame objektą, apžiūrime ir suderiname pasiūlymą.",
  },
  {
    when: "Pagal jūsų poreikį",
    title: "Pasirenkate apšvietimą",
    text: "Nuomojamos XP arba LLinks lemputės, pirktos girliandos arba jūsų turimos lemputės.",
  },
  {
    when: "Suderintu laiku",
    title: "Mes sumontuojame",
    text: "Atvažiuojame, papuošiame ir sumontuojame sutartą apšvietimą.",
  },
  {
    when: "Po sezono",
    title: "Viską nuimame",
    text: "Montavimo tarifas apima ir nuėmimą po sezono. Nuomotas lemputes pasiimame, jūsų lemputės lieka jums.",
  },
];
// Klausimai, kurie kartojasi keliuose puslapiuose.
const buyVsRentFaq = {
  q: "Kuo skiriasi pirkimas nuo nuomos?",
  a: "XP ir komercinės klasės LLinks girliandas galite įsigyti 7,5 m sekcijomis arba 45 m ir 60 m komplektais. Jos lieka jums. Nuoma skaičiuojama pagal dekoruojamo kontūro ilgį ir suderinama individualiu pasiūlymu; po sezono nuomotas lemputes pasiimame.",
};
const ownLightsFaq = {
  q: "Ar galite papuošti mano turimomis lemputėmis?",
  a: `Taip. Kabinimo ir nuėmimo po sezono standartinis tarifas su kliento lemputėmis yra ${formatPrice(pricing.clientLightsPerMeter)}/m. Prieš darbus aptariame jų tinkamumą ir konkretaus objekto sąlygas.`,
};
const areaFaq = {
  q: "Kur dirbate?",
  a: `Vilniuje ir Vilniaus apskrityje: ${site.serviceTowns.join(", ")}. Dėl konkretaus objekto susisiekite su mumis.`,
};
const removalFaq = {
  q: "Ar nuėmimas apmokestinamas atskirai?",
  a: "Ne. Nurodytas darbo tarifas apima kabinimą ir nuėmimą po sezono. Lempučių nuomos dalis pateikiama atskirai nuo darbų.",
};
const seriesFaq = {
  q: "Kuo skiriasi XP ir LLinks?",
  a: "Kataloge LLinks nurodyta kaip komercinės klasės profesionali lauko LED sistema, XP — kaip aukščiausios kokybės lauko LED serija. Abi serijos yra šiltai baltos. Padėsime pasirinkti pagal jūsų objektą.",
};

export const faqs = [
  buyVsRentFaq,
  {
    q: "Kokia garantija suteikiama lemputėms?",
    a: "Lemputėms suteikiame 2 metų garantiją. Pastebėję gedimą, susisiekite su mumis.",
  },
  {
    q: "Kiek kainuoja montavimas ir nuėmimas?",
    a: `Naudojant mūsų lemputes standartinis kabinimo ir nuėmimo po sezono tarifas yra ${formatPrice(pricing.installPerMeter)}/m, naudojant jūsų lemputes — ${formatPrice(pricing.clientLightsPerMeter)}/m. Pavyzdžiui, 12 × 12 m pastato 48 m kontūras su ${exampleLights} ir darbais kainuoja ${formatPrice(example.total)}. Galutinę darbo kainą suderiname pagal objektą.`,
  },
  {
    q: "Kada montuojate ir nuimate?",
    a: "Montavimo laiką sutariame su jumis, o po šventinio sezono apšvietimą nuimame. Konkretų grafiką aptariame suderindami pasiūlymą.",
  },
  ownLightsFaq,
  {
    q: "Ar papildomą sekciją galima naudoti kaip pradinį rinkinį?",
    a: "Papildoma sekcija skirta papildyti tos pačios serijos motininę girliandą. Pradiniam rinkiniui rinkitės motininę girliandą arba komplektą, kuriame ji jau yra. XP ir LLinks kataloge išskirtos atskirai.",
  },
  areaFaq,
];
export const showcase = [
  {
    src: "/work/porch-house.jpg",
    alt: "Namo stogo ir verandos dekoravimo pavyzdys",
    label: "Stogas ir veranda",
  },
  {
    src: "/work/modern-villa.jpg",
    alt: "Modernaus namo apšvietimo pavyzdys",
    label: "Modernaus namo kontūrai",
  },
  {
    src: "/work/warm-cabin.jpg",
    alt: "Namo stogo ir medžių dekoravimo pavyzdys",
    label: "Stogas ir medžiai",
  },
  {
    src: "/work/modern-pool.jpg",
    alt: "Stogo kraštų ir langų apšvietimo pavyzdys",
    label: "Stogas ir langai",
  },
];
export const decorAreas = [
  {
    icon: "roof",
    title: "Stogo kraštai",
    text: "Apšvietimas palei stogo kontūrą.",
  },
  {
    icon: "window",
    title: "Langai ir durys",
    text: "Langų, durų ir įėjimo kontūrai.",
  },
  {
    icon: "terrace",
    title: "Terasos ir turėklai",
    text: "Verandos, balkonai, turėklai ir laiptai.",
  },
  {
    icon: "tree",
    title: "Medžiai ir eglės",
    text: "Kiemo medžių ir eglučių apšvietimas.",
  },
  {
    icon: "fence",
    title: "Tvoros ir vartai",
    text: "Šventinis apšvietimas palei tvorą ir vartus.",
  },
  {
    icon: "estate",
    title: "Sodybos ir dideli namai",
    text: "Individualus planas pastatams ir jų aplinkai.",
  },
] as const;
export const rentalFaqs = [
  {
    q: "Kiek kainuoja lempučių nuoma?",
    a: `XP lauko LED nuoma kainuoja ${formatPrice(pricing.rentalPerMeter.xp)}/m, komercinės klasės LLinks — ${formatPrice(pricing.rentalPerMeter.llinks)}/m. Tai nuomos tarifas už dekoruojamą metrą. Kabinimas ir nuėmimas su mūsų lemputėmis — ${formatPrice(pricing.installPerMeter)}/m. Konkrečiam objektui suderiname galutinį pasiūlymą.`,
  },
  removalFaq,
  {
    q: "Ar galiu nuomotis be montavimo?",
    a: "Parašykite, kokio apšvietimo ir ilgio reikia. Atskirai suderinsime nuomos, pristatymo ir grąžinimo sąlygas. Galutinį nuomos pasiūlymą pateiksime pagal jūsų poreikį.",
  },
  seriesFaq,
];
export const pricingFaqs = [
  {
    q: "Ar skaičiuoklės kaina yra galutinė?",
    a: "Skaičiuoklė rodo standartinę kainą pagal viešus tarifus. Galutinę darbo kainą ir sąlygas suderiname įvertinę konkretų objektą — atvažiuojame į nemokamą apžiūrą, išmatuojame ir pasakome tikslią kainą.",
  },
  removalFaq,
  seriesFaq,
  ownLightsFaq,
  buyVsRentFaq,
  areaFaq,
];
