import { formatMeters, formatPrice } from "../format";
import { site } from "../site";
import { pricing } from "./pricing";
import { buildEstimate, priceExample } from "./priceExample";
import { seriesNames } from "./products";

const example = buildEstimate()!;
const exampleLights =
  example.choice === "client"
    ? "jūsų lemputėmis"
    : `${seriesNames[example.choice]} nuoma`;
/** e.g. "12 × 12 m pastato 48 m kontūras su XP nuoma ir darbais kainuoja 360,48 €" */
const exampleCost = `${priceExample.width} × ${priceExample.length} m pastato ${formatMeters(example.meters)} kontūras su ${exampleLights} ir darbais kainuoja ${formatPrice(example.total)}`;
// Klausimai, kurie kartojasi keliuose puslapiuose.
const buyVsRentFaq = {
  q: "Kuo skiriasi pirkimas nuo nuomos?",
  a: "XP ir komercinės klasės LLinks girliandas galite įsigyti 7,5 m sekcijomis arba 45 m ir 60 m komplektais. Jos lieka jums. Nuoma skaičiuojama pagal dekoruojamo kontūro ilgį ir suderinama individualiu pasiūlymu; po sezono nuomotas lemputes pasiimame.",
};
const ownLightsFaq = {
  q: "Ar galite papuošti mano turimomis lemputėmis?",
  a: "Taip, galime.",
};
const areaFaq = {
  q: "Kur dirbate?",
  a: `Vilniuje ir Vilniaus apskrityje: ${site.serviceTowns.join(", ")}. Dėl konkretaus objekto susisiekite su mumis.`,
};
const removalFaq = {
  q: "Ar nuėmimas apmokestinamas atskirai?",
  a: "Ne. Nurodytas darbo tarifas apima kabinimą ir nuėmimą po sezono. Lempučių nuomos dalis pateikiama atskirai nuo darbų.",
};
const installCostFaq = {
  q: "Kiek kainuoja kalėdinių lempučių montavimas?",
  a: `Montavimo kaina — nuo ${formatPrice(pricing.installPerMeter)} už metrą. Galutinė kaina priklauso nuo jūsų pageidavimų, projekto ir vietos. Tikslią kainą pasakysime įvertinę jūsų objektą.`,
};
const seriesFaq = {
  q: "Kuo skiriasi XP ir LLinks?",
  a: "Kataloge LLinks nurodyta kaip komercinės klasės profesionali lauko LED sistema, XP — kaip aukščiausios kokybės lauko LED serija. Abi serijos yra šiltai baltos. Padėsime pasirinkti pagal jūsų objektą.",
};

export const faqs = [
  buyVsRentFaq,
  {
    q: "Kiek kainuoja pristatymas?",
    a: `Pirktas lemputes pristatome visoje Lietuvoje: į pasirinktą Omniva paštomatą už ${formatPrice(pricing.delivery.parcel)} arba kurjeriu nurodytu adresu už ${formatPrice(pricing.delivery.courier)}. Pristatymo būdą pasirinksite užsakydami. Užsakius montavimą, lemputes atvešime patys montavimo metu nemokamai.`,
  },
  {
    q: "Kokia garantija suteikiama lemputėms?",
    a: "Lemputėms suteikiame 2 metų garantiją. Pastebėję gedimą, susisiekite su mumis.",
  },
  installCostFaq,
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
export const halloweenFaqs = [
  {
    q: "Ar spėsite papuošti iki Helovyno?",
    a: "Montavimo datą suderiname su jumis. Kad namai švytėtų jau Helovyno vakarą, susisiekite kuo anksčiau — pasistengsime rasti laiką prieš spalio 31-ąją.",
  },
  {
    q: "Ar apšvietimą galima palikti ir Kalėdoms?",
    a: "Šiltai baltos girliandos tinka ir Helovynui, ir Kalėdoms. Montavimo ir nuėmimo laiką suderiname su jumis, o nuėmimas po sezono jau įskaičiuotas į darbo tarifą.",
  },
  {
    q: "Ar galite papuošti oranžinėmis ar violetinėmis lemputėmis?",
    a: `Mūsų XP ir LLinks girliandos yra šiltai baltos. Jei turite savų spalvotų Helovyno lempučių, papuošime ir jomis — standartinis kabinimo ir nuėmimo tarifas su kliento lemputėmis yra ${formatPrice(pricing.clientLightsPerMeter)}/m.`,
  },
  ...faqs,
];
export const showcase = [
  {
    src: "/work/lithuanian-house-xp-timber-cottage.png",
    alt: "Medinis kaimo namas su LED girliandomis palei stogo kraštus ir prieangį",
    label: "Stogas ir prieangis",
  },
  {
    src: "/work/lithuanian-house-xp-red-brick.png",
    alt: "Mūrinis namas su LED girliandomis palei stogo kraštus ir balkono turėklą",
    label: "Stogas ir balkonas",
  },
  {
    src: "/work/lithuanian-house-xp-modern-gable.png",
    alt: "Modernus namas su LED girliandomis palei frontoną ir karnizą",
    label: "Modernaus namo kontūrai",
  },
  {
    src: "/work/lithuanian-house-xp-single-storey.png",
    alt: "Vienaaukštis namas su LED girliandomis palei visą stogo karnizą",
    label: "Stogo karnizas",
  },
  {
    src: "/work/lithuanian-house-xp-v2.png",
    alt: "Namas su LED girliandomis palei abu frontonus ir karnizą",
    label: "Frontonai ir karnizai",
  },
];
export const halloweenShowcaseLabels = [
  "Prieangis saldainių medžiotojams",
  "Balkonas pilnaties šviesoje",
  "Modernus vaiduoklių namas",
  "Karnizas, švytintis per rūką",
  "Frontonai po pilnatimi",
];
export const rentalFaqs = [
  {
    q: "Kiek kainuoja kalėdinių lempučių nuoma?",
    a: `XP lauko LED nuoma kainuoja ${formatPrice(pricing.rentalPerMeter.xp)}/m, komercinės klasės LLinks — ${formatPrice(pricing.rentalPerMeter.llinks)}/m. Tai nuomos tarifas už dekoruojamą metrą. Kabinimas ir nuėmimas su mūsų lemputėmis — ${formatPrice(pricing.installPerMeter)}/m. Konkrečiam objektui suderiname galutinį pasiūlymą.`,
  },
  {
    q: "Ar kalėdinių lempučių nuoma būna su montavimu?",
    a: `Taip, dažniausiai nuomą užsakote kartu su montavimu: atvežame girliandas, jas sumontuojame, o po sezono nuimame ir pasiimame. Montavimas ir nuėmimas su mūsų lemputėmis kainuoja ${formatPrice(pricing.installPerMeter)}/m, lemputes atvežame nemokamai.`,
  },
  removalFaq,
  {
    q: "Ar galiu nuomotis be montavimo?",
    a: "Parašykite, kokio apšvietimo ir ilgio reikia. Atskirai suderinsime nuomos, pristatymo ir grąžinimo sąlygas. Galutinį nuomos pasiūlymą pateiksime pagal jūsų poreikį.",
  },
  seriesFaq,
  areaFaq,
];
export const pricingFaqs = [
  installCostFaq,
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

/** A keyword-rich explanation of a service: what search engines read, written for people. */
export interface ServiceGuide {
  eyebrow: string;
  title: string;
  text: string;
  topics: { title: string; text: string; link?: { href: string; label: string } }[];
}

export const rentalGuide: ServiceGuide = {
  eyebrow: "Lauko girliandų nuoma",
  title: "Kalėdinių girliandų nuoma su montavimu",
  text: "Nuoma tinka, kai norite gražiai apšviesto namo per šventes, bet nenorite pirkti lempučių, jų prižiūrėti ir laikyti visus metus.",
  topics: [
    {
      title: "Kaip vyksta kalėdinių lempučių nuoma",
      text: "Pasirenkate XP arba komercinės klasės LLinks lauko LED girliandas, o mes jas atvežame, sumontuojame ir po sezono nuimame bei pasiimame. Nuomos laiką ir darbų datas suderiname su jumis.",
    },
    {
      title: "Kiek kainuoja kalėdinių lempučių nuoma",
      text: `XP lauko girliandų nuoma visam sezonui kainuoja ${formatPrice(pricing.rentalPerMeter.xp)}/m, LLinks — ${formatPrice(pricing.rentalPerMeter.llinks)}/m. Montavimas ir nuėmimas — ${formatPrice(pricing.installPerMeter)}/m. Pavyzdžiui, ${exampleCost}.`,
    },
    {
      title: "Nuoma ar pirkimas?",
      text: "Nuomojantis nereikia pirkti girliandų ir rūpintis jų laikymu — po švenčių jas pasiimame. Jei norite, kad lemputės liktų jums, XP ir LLinks girliandas galite įsigyti 7,5 m sekcijomis arba 45 m ir 60 m komplektais.",
      link: { href: "/kaledines-lemputes", label: "Žiūrėti lauko girliandas" },
    },
    {
      title: "Lauko girliandų nuoma be montavimo",
      text: "Norite pasikabinti patys? Parašykite, kokio apšvietimo ir ilgio reikia — atskirai suderinsime nuomos, pristatymo ir grąžinimo sąlygas.",
      link: { href: "/kontaktai#forma", label: "Parašyti užklausą" },
    },
  ],
};
