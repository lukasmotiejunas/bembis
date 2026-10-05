import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileContactBar from "@/components/MobileContactBar";
import CartHydration from "@/components/CartHydration";
import { site } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s | ${site.name}`,
    default: `Kalėdinių lempučių montavimas ir nuoma Vilniuje | ${site.name}`,
  },
  description:
    "Kalėdinių lempučių montavimas, nuoma ir pardavimas Vilniuje ir Vilniaus apskrityje. Atvažiuojame, papuošiame namus, po švenčių nuimame. 2 metų garantija.",
  applicationName: site.name,
  keywords: [
    "kalėdinių lempučių montavimas",
    "kalėdinių lempučių nuoma",
    "kalėdinės lemputės",
    "lauko kalėdinės lemputės",
    "namo puošimas Kalėdoms",
    "kalėdinis namo apšvietimas",
    "Vilnius",
  ],
  openGraph: {
    type: "website",
    locale: "lt_LT",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: true, email: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="pb-20 md:pb-0">
        <CartHydration />
        <TopBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileContactBar />
      </body>
    </html>
  );
}
