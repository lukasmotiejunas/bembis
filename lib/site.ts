// Visi kontaktai vienoje vietoje — pakeitus čia, atsinaujina visame puslapyje.
export const site = {
  name: "Bembis",
  description:
    "Kalėdinių lempučių pardavimas, nuoma ir montavimas. Atvažiuojame, papuošiame jūsų namus, o po švenčių viską nuimame.",
  phone: "+370 600 00 000",
  email: "labas@bembis.lt",
  serviceArea: "Vilnius ir Vilniaus apskritis",
  hours: [
    { days: "I–V", time: "9:00–19:00" },
    { days: "VI", time: "10:00–16:00" },
  ],
  // Įrašykite pilną nuorodą, kad ji atsirastų puslapio apačioje.
  socials: [
    { label: "Facebook", href: "" },
    { label: "Instagram", href: "" },
  ],
};

export const phoneHref = `tel:${site.phone.replace(/\s/g, "")}`;
export const emailHref = `mailto:${site.email}`;
export const activeSocials = site.socials.filter((s) => s.href);
