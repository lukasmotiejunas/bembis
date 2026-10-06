import { Mail, MapPin, Phone } from "lucide-react";
import { emailHref, phoneHref, site } from "@/lib/site";
import InquiryForm from "../InquiryForm";
import SectionHeading from "../ui/SectionHeading";

export default function ContactSection({
  titleAs = "h2",
  defaultServices,
  defaultMessage,
}: {
  titleAs?: "h1" | "h2";
  defaultServices?: string[];
  defaultMessage?: string;
}) {
  const isPage = titleAs === "h1";
  return (
    <section
      id="kontaktai"
      className={
        isPage ? "bg-cream pt-6 pb-20 sm:pb-28" : "bg-cream py-20 sm:py-28"
      }
    >
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            as={titleAs}
            eyebrow="Kontaktai"
            title="Pasikalbėkime apie jūsų namus"
            text="Paskambinkite, parašykite arba palikite užklausą. Padėsime išsirinkti lemputes ir pasakysime kainą."
          />

          <div className="mt-10 space-y-3">
            <a
              href={phoneHref}
              className="group flex items-center gap-5 rounded-3xl bg-pine-900 p-6 text-snow transition-colors hover:bg-pine-800"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-glow text-pine-950">
                <Phone className="size-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-snow/65">Skambinkite</span>
                <span className="font-display text-2xl font-medium sm:text-3xl">
                  {site.phone}
                </span>
              </span>
            </a>
            <a
              href={emailHref}
              className="flex items-center gap-5 rounded-3xl bg-white p-6 transition-colors hover:bg-snow"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-glow-soft text-glow-deep">
                <Mail className="size-6" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-stone">Rašykite</span>
                <span className="block truncate text-xl font-bold text-pine-900">
                  {site.email}
                </span>
              </span>
            </a>
            <div className="flex gap-4 rounded-3xl bg-white p-6">
              <MapPin
                className="mt-0.5 size-5 shrink-0 text-glow-deep"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm text-stone">Dirbame</p>
                <p className="font-bold text-pine-900">{site.serviceArea}</p>
              </div>
            </div>
          </div>
        </div>

        <div id="forma" className="scroll-mt-28">
          <InquiryForm
            defaultServices={defaultServices}
            defaultMessage={defaultMessage}
          />
        </div>
      </div>
    </section>
  );
}
