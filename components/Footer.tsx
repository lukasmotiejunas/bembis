import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { productFor, productHref } from "@/lib/data/products";
import { activeSocials, emailHref, phoneHref, site } from "@/lib/site";
import Logo from "./Logo";

const links = [
  { href: "/montavimas", label: "Kalėdinių lempučių montavimas" },
  { href: "/kiek-kainuoja", label: "Kiek kainuoja" },
  { href: "/nuoma", label: "Kalėdinių lempučių nuoma" },
  { href: "/kaledines-lemputes", label: "Kalėdinės lemputės" },
  { href: productHref(productFor("buy")), label: "Pirkti lemputes" },
  { href: "/kontaktai", label: "Kontaktai" },
];

export default function Footer() {
  return (
    <footer className="bg-pine-950 text-snow/75">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo id="logo-footer" light />
          <p className="mt-5 max-w-sm leading-relaxed">
            Kalėdinės lemputės jūsų namams: parduodame, nuomojame, sumontuojame ir po švenčių nuimame.
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
            {links.map((l) => (
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
                  className="rounded-full border border-snow/20 px-4 py-2 text-sm font-semibold hover:border-glow hover:text-glow"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-snow/10">
        <div className="container-page py-6 text-sm text-snow/50">
          © {new Date().getFullYear()} {site.name}. Visos teisės saugomos.
        </div>
      </div>
    </footer>
  );
}
