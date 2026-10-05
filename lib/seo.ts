// SEO helpers: per-page metadata and structured data (schema.org JSON-LD) that tells Google
// what the business offers, where and for how much.
import type { Metadata } from "next";
import { guarantee, productHref } from "./data/products";
import { pricing } from "./data/pricing";
import { Product } from "./types";
import { activeSocials, site } from "./site";

/** Full address of a page; the home page is the bare domain, exactly as in its canonical tag. */
export const absoluteUrl = (path = "/") => (path === "/" ? site.url : new URL(path, site.url).toString());

const defaultShareImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${site.name} — kalėdinių lempučių montavimas, nuoma ir pardavimas Vilniuje`,
};

/**
 * Title, description, canonical address and share preview for one page.
 * Every indexable page must call this — otherwise it would inherit another page's canonical address.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  images,
}: {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is, without " | Kalėdų Dekoras" */
  absoluteTitle?: boolean;
  images?: { url: string; width?: number; height?: number; alt: string }[];
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "lt_LT",
      siteName: site.name,
      url: path,
      title: absoluteTitle ? title : `${title} | ${site.name}`,
      description,
      // A page's openGraph replaces the site-wide one, so always include an image.
      images: images ?? [defaultShareImage],
    },
  };
}

const BUSINESS_ID = `${site.url}/#business`;
const phone = site.phone.replace(/\s/g, "");

const areaServed = [
  { "@type": "City", name: "Vilnius" },
  { "@type": "AdministrativeArea", name: "Vilniaus apskritis" },
  ...site.serviceTowns.filter((t) => t !== "Vilnius").map((name) => ({ "@type": "Place", name })),
];

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl("/opengraph-image.png"),
    description: site.description,
    telephone: phone,
    email: site.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vilnius",
      addressRegion: "Vilniaus apskritis",
      addressCountry: "LT",
    },
    areaServed,
    // Dirbame visada
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    knowsAbout: [
      "Kalėdinių lempučių montavimas",
      "Kalėdinių lempučių nuoma",
      "Kalėdinės lemputės",
      "Namų puošimas Kalėdoms",
      "Lauko kalėdinis apšvietimas",
    ],
    ...(activeSocials.length ? { sameAs: activeSocials.map((s) => s.href) } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: "lt-LT",
    publisher: { "@id": BUSINESS_ID },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const warranty = {
  "@type": "WarrantyPromise",
  durationOfWarranty: { "@type": "QuantitativeValue", value: guarantee.years, unitCode: "ANN" },
};

export function productSchema(product: Product) {
  const rent = product.mode === "rent";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: rent ? `${product.name} — nuoma sezonui` : product.name,
    description: product.description,
    image: [absoluteUrl(product.image)],
    sku: `KD-${product.id}`,
    brand: { "@type": "Brand", name: site.name },
    color: product.color,
    additionalProperty: product.specs.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(productHref(product)),
      price: product.price.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      businessFunction: rent ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
      ...(rent ? { description: "Nuoma visam sezonui (lapkritis–sausis)" } : {}),
      areaServed,
      warranty,
      seller: { "@id": BUSINESS_ID },
    },
  };
}

const perMeter = (name: string, price: number) => ({
  "@type": "Offer",
  name,
  priceCurrency: "EUR",
  priceSpecification: { "@type": "UnitPriceSpecification", price: price.toFixed(2), priceCurrency: "EUR", unitText: "metras" },
});

export function installationServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Kalėdinių lempučių montavimas",
    name: "Kalėdinių lempučių montavimas ir nuėmimas",
    description:
      "Atvažiuojame, sumontuojame kalėdines lemputes ant namo stogo, langų, terasų, medžių ir tvorų, o po švenčių viską nuimame.",
    url: absoluteUrl("/montavimas"),
    provider: { "@id": BUSINESS_ID },
    areaServed,
    offers: [perMeter("Montavimas", pricing.installPerMeter), perMeter("Nuėmimas po švenčių", pricing.removalPerMeter)],
  };
}

export function rentalServiceSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Kalėdinių lempučių nuoma",
    name: "Kalėdinių lempučių nuoma visam sezonui",
    description: `${product.name} nuoma visam Kalėdų sezonui Vilniuje ir Vilniaus apskrityje. Galime sumontuoti ir po švenčių nuimti.`,
    url: absoluteUrl("/nuoma"),
    provider: { "@id": BUSINESS_ID },
    areaServed,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "EUR",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      description: "10 m girlianda visam sezonui",
      url: absoluteUrl(productHref(product)),
    },
  };
}
