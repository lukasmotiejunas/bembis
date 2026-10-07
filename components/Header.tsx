"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Mail, Menu, Phone, ShoppingBag, X } from "lucide-react";
import { cartTotals, resolveLines, useCartStore } from "@/lib/store/cartStore";
import { emailHref, phoneHref, site } from "@/lib/site";
import Logo from "./Logo";
import CartDrawer from "./CartDrawer";

const nav = [
  { href: "/montavimas", label: "Montavimas" },
  { href: "/kiek-kainuoja", label: "Kiek kainuoja" },
  { href: "/kaledines-lemputes", label: "Parduotuvė" },
  { href: "/kontaktai", label: "Kontaktai" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const { count } = cartTotals(resolveLines(items));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300",
          scrolled || menuOpen ? "border-sand bg-snow/95" : "border-transparent bg-snow/80"
        )}
      >
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
          <Logo id="logo-header" />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Pagrindinė navigacija">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors",
                  isActive(item.href) ? "bg-cream text-pine-900" : "text-stone hover:text-pine-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={phoneHref} className="btn btn-dark hidden min-h-11 px-5 text-sm lg:inline-flex">
              <Phone className="size-4" aria-hidden="true" />
              {site.phone}
            </a>
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex size-11 items-center justify-center rounded-full border-[1.5px] border-sand bg-white text-pine-900 transition-colors hover:border-pine-900"
              aria-label={`Krepšelis, prekių: ${count}`}
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-glow text-[0.7rem] font-extrabold text-pine-950">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex size-11 items-center justify-center rounded-full text-pine-900 md:hidden"
              aria-label={menuOpen ? "Uždaryti meniu" : "Atidaryti meniu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="animate-fade-in border-t border-sand md:hidden">
            <nav className="container-page flex flex-col py-3" aria-label="Mobili navigacija">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    "border-b border-sand/70 py-4 font-display text-2xl font-medium last:border-none",
                    isActive(item.href) ? "text-glow-deep" : "text-pine-900"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="container-page grid grid-cols-2 gap-3 pb-5">
              <a href={phoneHref} className="btn btn-dark">
                <Phone className="size-4" aria-hidden="true" />
                Skambinti
              </a>
              <a href={emailHref} className="btn btn-outline">
                <Mail className="size-4" aria-hidden="true" />
                Rašyti
              </a>
            </div>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
