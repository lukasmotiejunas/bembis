import { Garland } from "@/components/Lights";
import SpookyGarland from "@/components/halloween/SpookyGarland";
import JsonLd from "@/components/JsonLd";
import ContactSection from "@/components/sections/ContactSection";
import FAQ from "@/components/sections/FAQ";
import { businessSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { serviceOptions } from "@/lib/inquiry";
import { getSiteTheme } from "@/lib/themeStore";

const meta = {
  christmas: {
    title: "Kontaktai — kalėdinių lempučių montavimas ir nuoma",
    description: `Skambinkite ${site.phone} arba rašykite ${site.email}. Suderinsime kalėdinių lempučių montavimo, nuomos ar pirkimo pasiūlymą. Vilnius ir apskritis.`,
  },
  halloween: {
    title: "Kontaktai — Helovyno apšvietimo montavimas ir nuoma",
    description: `Skambinkite ${site.phone} arba rašykite ${site.email}. Suderinsime Helovyno ir šventinio apšvietimo montavimo, nuomos ar pirkimo pasiūlymą. Vilnius ir apskritis.`,
  },
};

export async function generateMetadata() {
  return pageMetadata({ ...meta[await getSiteTheme()], path: "/kontaktai" });
}

export default async function ContactPage(props: PageProps<"/kontaktai">) {
  const query = await props.searchParams;
  const picked = Array.isArray(query.paslauga)
    ? query.paslauga
    : [query.paslauga];
  const defaultServices = serviceOptions.filter((s) => picked.includes(s));
  const defaultMessage =
    typeof query.zinute === "string" ? query.zinute.slice(0, 2000) : "";
  return (
    <>
      <JsonLd data={businessSchema()} />
      <div className="bg-cream">
        {(await getSiteTheme()) === "halloween" ? (
          <SpookyGarland id="contact-garland" />
        ) : (
          <Garland id="contact-garland" />
        )}
      </div>
      <ContactSection
        titleAs="h1"
        defaultServices={defaultServices}
        defaultMessage={defaultMessage}
      />
      <FAQ />
    </>
  );
}
