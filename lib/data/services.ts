import { formatPrice } from "../format";
import { buildEstimate } from "./priceExample";

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
    a: "Vilniuje ir Vilniaus apskrityje. Gyvenate kitur? Paskambinkite — pažiūrėsime, ką galime padaryti.",
  },
];

export const showcase = [
  { src: "/work/porch-house.jpg", alt: "Namas su verandos ir stogo kraštų šiltomis lemputėmis", label: "Šilta balta · stogas ir veranda" },
  { src: "/work/modern-villa.jpg", alt: "Modernus namas, apjuostas šiltomis lemputėmis", label: "Šilta balta · modernus namas" },
  { src: "/work/multicolor-house.jpg", alt: "Dviaukštis namas su spalvotomis lemputėmis", label: "Spalvotos · visas fasadas" },
  { src: "/work/warm-cabin.jpg", alt: "Medinis namas su lemputėmis ant stogo ir medžių", label: "Šilta balta · stogas ir medžiai" },
  { src: "/work/modern-pool.jpg", alt: "Modernus namas su šiltomis lemputėmis ant stogo ir langų", label: "Šilta balta · stogas ir langai" },
];
