// Visi kontaktai vienoje vietoje — pakeitus čia, atsinaujina visame puslapyje.
export const site = {
  name: "Kalėdų Dekoras",
  /** Pagrindinis svetainės adresas (be „/“ gale) — naudojamas Google ir dalinimuisi socialiniuose tinkluose */
  url: "https://www.kaledudekoras.lt",
  description:
    "Kalėdinių lempučių pardavimas, nuoma ir montavimas. Atvažiuojame, papuošiame jūsų namus, o po švenčių viską nuimame.",
  phone: "+370 623 73 199",
  email: "info@kaledudekoras.lt",
  serviceArea: "Vilnius ir Vilniaus apskritis",
  /** Miestai, kuriuose dirbame — rodomi puslapiuose ir padeda Google rasti mus vietinėse paieškose */
  serviceTowns: ["Vilnius", "Vilniaus rajonas", "Trakai", "Lentvaris", "Elektrėnai", "Vievis", "Nemenčinė", "Šalčininkai", "Širvintos", "Ukmergė", "Švenčionys", "Pabradė"],
  // Įrašykite pilną nuorodą, kad ji atsirastų puslapio apačioje.
  socials: [
    { label: "Facebook", href: "" },
    { label: "Instagram", href: "" },
  ],
};

export const phoneHref = `tel:${site.phone.replace(/\s/g, "")}`;
export const emailHref = `mailto:${site.email}`;
export const activeSocials = site.socials.filter((s) => s.href);
