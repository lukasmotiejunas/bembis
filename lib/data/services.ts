import { formatPrice } from "../format";
import { site } from "../site";
import { pricing } from "./pricing";
import { buildEstimate } from "./priceExample";
import { productFor } from "./products";

const example = buildEstimate("rent");

export const seasonSteps = [
  {
    when: "Spalis–lapkritis",
    title: "Susisiekiate",
    text: "Paskambinkite arba parašykite. Atvažiuojame, apžiūrime namą ir pasiūlome kainą — nemokamai.",
  },
  {
    when: "Tą pačią savaitę",
    title: "Išsirenkate lemputes",
    text: "Pirkite arba išsinuomokite sezonui. Padėsime išsirinkti ir apskaičiuosime, kiek jų reikia.",
  },
  {
    when: "Lapkritis–gruodis",
    title: "Mes sumontuojame",
    text: "Atvažiuojame su visa įranga ir viską sumontuojame. Jums nereikia lipti ant kopėčių.",
  },
  {
    when: "Sausis",
    title: "Po švenčių nuimame",
    text: "Po Trijų Karalių viską nuimame. Nuomotas lemputes išsivežame, pirktas supakuojame jums.",
  },
];

export const faqs = [
  {
    q: "Kuo skiriasi pirkimas nuo nuomos?",
    a: "Parduodame šiltas baltas filamentines lemputes — jos lieka jums ir tarnaus daugelį sezonų. Nuomai siūlome spalvotas lemputes: jos šviečia visą sezoną, o po švenčių jas išsivežame — nereikia nei pirkti, nei sandėliuoti.",
  },
  {
    q: "Kokia garantija suteikiama lemputėms?",
    a: "Mūsų lemputėms suteikiame 2 metų garantiją. Jei sezono metu kuri nors lemputė sugestų — paskambinkite, pakeisime ją nemokamai.",
  },
  {
    q: "Kiek kainuoja montavimas?",
    a: `Kaina priklauso nuo namo dydžio ir lempučių kiekio. Pavyzdžiui, dviaukščiam namui su ${example.meters} m lempučių nuoma, montavimas ir demontavimas kainuoja ${formatPrice(example.total)} už sezoną. Tikslią kainą pasakysime po nemokamos apžiūros.`,
  },
  {
    q: "Kada montuojate ir kada nuimate?",
    a: "Montuojame nuo lapkričio pradžios iki gruodžio vidurio, nuimame sausį, po Trijų Karalių. Tikslią dieną suderiname su jumis iš anksto.",
  },
  {
    q: "Ar tvirtinimas nepažeis mano namo?",
    a: "Ne. Naudojame specialius laikiklius, kurie nepalieka skylių ar žymių ant stogo, latakų ir sienų.",
  },
  {
    q: "Ar reikia būti namuose montavimo metu?",
    a: "Nebūtina. Užtenka, kad būtų prieiga prie lauko elektros lizdo. Visas detales suderiname telefonu.",
  },
  {
    q: "Kur dirbate?",
    a: `Vilniuje ir visoje Vilniaus apskrityje: ${site.serviceTowns.join(", ")}. Gyvenate kitur? Paskambinkite — pažiūrėsime, ką galime padaryti.`,
  },
];

export const showcase = [
  { src: "/work/porch-house.jpg", alt: "Namas su verandos ir stogo kraštų šiltomis lemputėmis", label: "Šilta balta · stogas ir veranda" },
  { src: "/work/modern-villa.jpg", alt: "Modernus namas, apjuostas šiltomis lemputėmis", label: "Šilta balta · modernus namas" },
  { src: "/work/multicolor-house.jpg", alt: "Dviaukštis namas su spalvotomis lemputėmis", label: "Spalvotos · visas fasadas" },
  { src: "/work/warm-cabin.jpg", alt: "Medinis namas su lemputėmis ant stogo ir medžių", label: "Šilta balta · stogas ir medžiai" },
  { src: "/work/modern-pool.jpg", alt: "Modernus namas su šiltomis lemputėmis ant stogo ir langų", label: "Šilta balta · stogas ir langai" },
];

/** „Ką papuošiame“ — Montavimo puslapyje. */
export const decorAreas = [
  { icon: "roof", title: "Stogo kraštai", text: "Klasikinė lempučių linija palei stogą — namas matosi iš toli." },
  { icon: "window", title: "Langai ir durys", text: "Apjuosiame langus, duris ir įėjimą — jauku iš lauko ir vidaus." },
  { icon: "terrace", title: "Terasos ir turėklai", text: "Verandos, balkonai, turėklai ir laiptai." },
  { icon: "tree", title: "Medžiai ir eglės", text: "Apšviečiame kiemo medžius, eglutes ir krūmus." },
  { icon: "fence", title: "Tvoros ir vartai", text: "Lemputės palei tvorą ir vartus pasitinka svečius." },
  { icon: "estate", title: "Sodybos ir dideli namai", text: "Individualus planas visam kiemui, pastatams ir aplinkai." },
] as const;

const rentLight = productFor("rent");

/** DUK Nuomos puslapyje. */
export const rentalFaqs = [
  {
    q: "Kiek kainuoja kalėdinių lempučių nuoma?",
    a: `${rentLight.name} lempučių ${rentLight.meters} m girlianda kainuoja ${formatPrice(rentLight.price)} už visą sezoną. Montavimas — ${formatPrice(pricing.installPerMeter)} už metrą, nuėmimas po švenčių — ${formatPrice(pricing.removalPerMeter)} už metrą.`,
  },
  {
    q: "Kiek laiko trunka nuoma?",
    a: "Visą Kalėdų sezoną — nuo lapkričio iki sausio. Lemputes nuimame po Trijų Karalių.",
  },
  {
    q: "Ar galiu išsinuomoti lemputes be montavimo?",
    a: `Taip. Lemputes pristatysime į namus (${pricing.deliveryArea}) už ${formatPrice(pricing.deliveryFee)}, o po švenčių suderinsime, kaip jas grąžinti. Užsisakius montavimą, pristatymas nemokamas.`,
  },
  {
    q: "Kas, jei sezono metu lemputė sugenda?",
    a: "Paskambinkite — sugedusią lemputę pakeisime nemokamai. Lemputėms suteikiame 2 metų garantiją.",
  },
  {
    q: "Ar nuomotos lemputės tinka lauke?",
    a: "Taip. Tai lauko lemputės, atsparios lietui ir sniegui — tinka stogo kraštams, langams, medžiams ir tvoroms.",
  },
];
