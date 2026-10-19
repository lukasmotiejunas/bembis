import Link from "next/link";
import clsx from "clsx";
import { Mail, MapPin, Phone } from "lucide-react";
import { productFor, productHref } from "@/lib/data/products";
import { activeSocials, emailHref, phoneHref, site } from "@/lib/site";
import { getSiteTheme } from "@/lib/themeStore";
import Logo from "./Logo";
import SocialIcon from "./SocialIcon";
import Graveyard from "./halloween/Graveyard";
import { AnalyticsPreferencesButton } from "./GoogleAnalytics";

const links = [
  { href: "/montavimas", label: "Kalėdinių lempučių montavimas" },
  { href: "/kiek-kainuoja", label: "Kiek kainuoja" },
  { href: "/nuoma", label: "Kalėdinių lempučių nuoma" },
  { href: "/kaledines-lemputes", label: "Kalėdinės lemputės" },
  { href: productHref(productFor("buy")), label: "Pirkti lemputes" },
  { href: "/kontaktai", label: "Kontaktai" },
];
const halloweenLinks = [
  { href: "/montavimas", label: "Apšvietimo montavimas" },
  { href: "/kiek-kainuoja", label: "Kiek kainuoja" },
  { href: "/nuoma", label: "Lempučių nuoma" },
  { href: "/kaledines-lemputes", label: "Lauko LED girliandos" },
  { href: productHref(productFor("buy")), label: "Pirkti lemputes" },
  { href: "/kontaktai", label: "Kontaktai" },
];

const tagline = {
  christmas: "Kalėdinės lemputės jūsų namams: parduodame, nuomojame, sumontuojame ir po švenčių nuimame.",
  halloween: "Šiurpiai gražus apšvietimas jūsų namams: parduodame, nuomojame, sumontuojame ir po sezono nuimame.",
};

export default async function Footer() {
  const theme = await getSiteTheme();
  const halloween = theme === "halloween";
  return (
    <footer className={clsx("bg-pine-950 text-snow/75", halloween && "relative mt-30")}>
      {halloween && <Graveyard className="absolute inset-x-0 bottom-full" />}
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo id="logo-footer" light theme={theme} />
          <p className="mt-5 max-w-sm leading-relaxed">
            {tagline[theme]}
          </p>
          <a href={phoneHref} className="mt-8 block font-display text-3xl font-medium text-snow hover:text-glow sm:text-4xl">
            {site.phone}
          </a>
          <a href={emailHref} className="mt-2 inline-block text-lg hover:text-glow">
            {site.email}
          </a>
        </div>

        <div className="md:col-span-3">
          <h2 className="font-sans text-sm font-bold tracking-widest text-snow uppercase">Puslapiai</h2>
          <ul className="mt-5 space-y-3">
            {(halloween ? halloweenLinks : links).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-glow">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h2 className="font-sans text-sm font-bold tracking-widest text-snow uppercase">Kontaktai</h2>
          <ul className="mt-5 space-y-3">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-glow" aria-hidden="true" />
              <a href={phoneHref} className="hover:text-glow">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-glow" aria-hidden="true" />
              <a href={emailHref} className="hover:text-glow">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-glow" aria-hidden="true" />
              {site.serviceArea}
            </li>
          </ul>
          {activeSocials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {activeSocials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-snow/20 px-4 py-2 text-sm font-semibold hover:border-glow hover:text-glow"
                >
                  <SocialIcon name={s.label} className="size-4" />
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-snow/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-snow/50">
          <span>© {new Date().getFullYear()} {site.name}. Visos teisės saugomos.</span>
          <AnalyticsPreferencesButton measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""} />
        </div>
      </div>
    </footer>
  );
}
