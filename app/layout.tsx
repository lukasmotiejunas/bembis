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
  title: {
    template: `%s | ${site.name}`,
    default: `${site.name} — kalėdinės lemputės su montavimu`,
  },
  description: site.description,
  keywords: [
    "kalėdinės lemputės",
    "kalėdinių lempučių montavimas",
    "kalėdinių lempučių nuoma",
    "namų puošimas",
    "Vilnius",
  ],
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
