// SEO helpers: per-page metadata and structured data (schema.org JSON-LD) that tells Google
// what the business offers, where and for how much.
import type { Metadata } from "next";
import { productHref, products, returnPolicy } from "./data/products";
import { pricing } from "./data/pricing";
import { Product } from "./types";
import { activeSocials, site } from "./site";

/** Full address of a page; the home page is the bare domain, exactly as in its canonical tag. */
export const absoluteUrl = (path = "/") =>
  path === "/" ? site.url : new URL(path, site.url).toString();

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
  ...site.serviceTowns
    .filter((t) => t !== "Vilnius")
    .map((name) => ({ "@type": "Place", name })),
];

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": BUSINESS_ID,
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl("/opengraph-image.png"),
    description: site.description,
    telephone: phone,
    email: site.email,
    knowsAbout: [
      "Kalėdinių lempučių montavimas",
      "Kalėdinių lempučių nuoma",
      "Kalėdinės lemputės",
      "Namų puošimas Kalėdoms",
      "Lauko kalėdinis apšvietimas",
    ],
    ...(activeSocials.length
      ? { sameAs: activeSocials.map((s) => s.href) }
      : {}),
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

const merchantReturnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "LT",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: returnPolicy.days,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
};

// Siunčiame visoje Lietuvoje: į Omniva paštomatą arba kurjeriu.
const shippingDetails = Object.values(pricing.delivery).map((fee) => ({
  "@type": "OfferShippingDetails",
  shippingRate: { "@type": "MonetaryAmount", value: fee, currency: "EUR" },
  shippingDestination: { "@type": "DefinedRegion", addressCountry: "LT" },
}));

export function productSchema(product: Product) {
  // Pardavimo kainos ir prekių gavimas patvirtinti 2026-10-06.
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(productHref(product))}#product`,
    url: absoluteUrl(productHref(product)),
    name: product.name,
    description: product.description,
    // Apšvietimo schemos neteikiame kaip produkto nuotraukos paieškai.
    ...(product.kind !== "bundle" ? { sku: product.id } : {}),
    color: product.color,
    additionalProperty: product.specs.map((s) => ({
      "@type": "PropertyValue",
      name: s.label,
      value: s.value,
    })),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(productHref(product)),
      price: product.price.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      seller: { "@id": BUSINESS_ID },
      hasMerchantReturnPolicy: merchantReturnPolicy,
      shippingDetails,
    },
  };
}

export function catalogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "XP ir LLinks lauko LED girliandos ir komplektai",
    url: absoluteUrl("/kaledines-lemputes"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: absoluteUrl(productHref(product)),
      })),
    },
  };
}

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
  };
}

export function rentalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Kalėdinių lempučių nuoma",
    name: "Kalėdinių lempučių nuoma visam sezonui",
    description: `Šiltai baltų XP ir komercinės klasės LLinks lauko LED nuoma Vilniuje ir Vilniaus apskrityje. Standartiniai tarifai: XP ${pricing.rentalPerMeter.xp} EUR/m, LLinks ${pricing.rentalPerMeter.llinks} EUR/m. Darbų ir nuomos sąlygos suderinamos konkrečiam objektui.`,
    url: absoluteUrl("/nuoma"),
    provider: { "@id": BUSINESS_ID },
    areaServed,
  };
}
