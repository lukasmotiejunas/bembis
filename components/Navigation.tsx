"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import CartDrawer from "./CartDrawer";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCartStore();
  const cartCount = totalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-[#08091a]/95 backdrop-blur-xl border-b border-[#1e2d52]/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C9A227, #E8C84A)" }}>
              <span className="text-sm font-bold text-yellow-950">B</span>
            </div>
            <span className="font-display font-bold text-xl text-[#FFF5E6] group-hover:text-[#E8C84A] transition-colors">
              Bembis
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/visualize"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(232,200,74,0.08))",
                border: "1px solid rgba(201,162,39,0.4)",
                color: "#E8C84A",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Namų peržiūra
            </Link>

            <NavLink href="/shop">Parduotuvė</NavLink>
            <NavLink href="/installation">Montavimas</NavLink>
            <NavLink href="/gallery">Galerija</NavLink>
            <NavLink href="/#how-it-works">Kaip tai veikia</NavLink>
            <NavLink href="/#faq">D.U.K.</NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative p-2 text-[#C4A882] hover:text-[#E8C84A] transition-colors"
              aria-label="Atidaryti krepšelį"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-yellow-950"
                  style={{ background: "linear-gradient(135deg, #C9A227, #E8C84A)" }}>
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 text-[#C4A882] hover:text-[#E8C84A] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Atidaryti meniu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link
              href="/visualize"
              className="hidden md:flex btn-gold text-sm px-5 py-2.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Vizualizuoti namus
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 mx-4 rounded-2xl border border-[#1e2d52] overflow-hidden"
            style={{ background: "rgba(13, 18, 48, 0.97)", backdropFilter: "blur(20px)" }}>
            <div className="p-4 space-y-1">
              <MobileNavLink href="/visualize" onClick={() => setMobileOpen(false)} highlight>
                ✨ AI Namų peržiūra
              </MobileNavLink>
              <MobileNavLink href="/shop" onClick={() => setMobileOpen(false)}>Parduotuvė</MobileNavLink>
              <MobileNavLink href="/installation" onClick={() => setMobileOpen(false)}>Montavimas</MobileNavLink>
              <MobileNavLink href="/gallery" onClick={() => setMobileOpen(false)}>Galerija</MobileNavLink>
              <MobileNavLink href="/#how-it-works" onClick={() => setMobileOpen(false)}>Kaip tai veikia</MobileNavLink>
              <MobileNavLink href="/#faq" onClick={() => setMobileOpen(false)}>D.U.K.</MobileNavLink>
              <div className="pt-2">
                <Link
                  href="/visualize"
                  className="btn-gold w-full justify-center text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <Sparkles className="w-4 h-4" />
                  Vizualizuoti namus
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer />
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm text-[#C4A882] hover:text-[#FFF5E6] transition-colors rounded-full hover:bg-white/5"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
  highlight,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
        highlight
          ? "text-[#E8C84A] bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.3)]"
          : "text-[#C4A882] hover:text-[#FFF5E6] hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}
