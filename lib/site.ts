// Visi kontaktai vienoje vietoje — pakeitus čia, atsinaujina visame puslapyje.
export const site = {
  name: "Kalėdų Dekoras",
  description:
    "Kalėdinių lempučių pardavimas, nuoma ir montavimas. Atvažiuojame, papuošiame jūsų namus, o po švenčių viską nuimame.",
  phone: "+370 623 73 199",
  email: "info@kaledudekoras.lt",
  serviceArea: "Vilnius ir Vilniaus apskritis",
  // Įrašykite pilną nuorodą, kad ji atsirastų puslapio apačioje.
  socials: [
    { label: "Facebook", href: "" },
    { label: "Instagram", href: "" },
  ],
};

export const phoneHref = `tel:${site.phone.replace(/\s/g, "")}`;
export const emailHref = `mailto:${site.email}`;
export const activeSocials = site.socials.filter((s) => s.href);
