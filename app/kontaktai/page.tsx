import { Garland } from "@/components/Lights";
import JsonLd from "@/components/JsonLd";
import ContactSection from "@/components/sections/ContactSection";
import FAQ from "@/components/sections/FAQ";
import { businessSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { serviceOptions } from "@/lib/inquiry";

export const metadata = pageMetadata({
  title: "Kontaktai — kalėdinių lempučių montavimas ir nuoma",
  description: `Skambinkite ${site.phone} arba rašykite ${site.email}. Suderinsime kalėdinių lempučių montavimo, nuomos ar pirkimo pasiūlymą. Vilnius ir apskritis.`,
  path: "/kontaktai",
});

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
        <Garland id="contact-garland" />
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
