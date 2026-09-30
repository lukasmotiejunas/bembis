import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#08091a] border-t border-[#1e2d52]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #C9A227, #E8C84A)",
                }}
              >
                <span className="text-sm font-bold text-yellow-950">B</span>
              </div>
              <span className="font-display font-bold text-xl text-[#FFF5E6]">
                Bembis
              </span>
            </Link>
            <p className="text-sm text-[#C4A882] leading-relaxed">
              Aukščiausios kokybės Kalėdinės lemputės ir profesionalus namų
              puošimo montavimas. Mes įgyvendiname jūsų Kalėdinę viziją.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-[#1e2d52] flex items-center justify-center text-[#C4A882] hover:text-[#C9A227] hover:border-[#C9A227]/40 transition-colors text-xs font-bold"
              >
                IG
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-[#1e2d52] flex items-center justify-center text-[#C4A882] hover:text-[#C9A227] hover:border-[#C9A227]/40 transition-colors text-xs font-bold"
              >
                FB
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#FFF5E6] font-semibold mb-4 text-sm uppercase tracking-wider">
              Paslaugos
            </h4>
            <ul className="space-y-3">
              {[
                { label: "AI Namų vizualizacija", href: "/visualize" },
                { label: "Parduotuvė", href: "/shop" },
                { label: "Montavimo paslauga", href: "/installation" },
                { label: "Galerija", href: "/gallery" },
                { label: "Gauti kainoraštį", href: "/visualize" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#C4A882] hover:text-[#E8C84A] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#FFF5E6] font-semibold mb-4 text-sm uppercase tracking-wider">
              Kontaktai
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-[#C4A882]">
                <Phone className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>+370 600 00 000</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#C4A882]">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>labas@bembis.lt</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#C4A882]">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>
                  Vilnius, Lietuva
                  <br />
                  Aptarnaujame visus pagrindinius miestus
                </span>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-[#131c35] border border-[#1e2d52]">
              <p className="text-xs text-[#C4A882] mb-3">
                Norite išpuošti savo namus?
              </p>
              <Link
                href="/visualize"
                className="btn-gold text-xs px-4 py-2 w-full justify-center"
              >
                <Sparkles className="w-3 h-3" />
                Vizualizuoti namus
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#1e2d52] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#C4A882]/60">
          <p>© 2024 Bembis. Visos teisės saugomos.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-[#C4A882] transition-colors">
              Privatumo politika
            </Link>
            <Link href="#" className="hover:text-[#C4A882] transition-colors">
              Naudojimo sąlygos
            </Link>
            <Link href="#" className="hover:text-[#C4A882] transition-colors">
              Slapukų politika
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
