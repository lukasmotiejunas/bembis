import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Bembis — Kalėdinės lemputės ir profesionalus namų puošimas",
  description:
    "Įkelkite savo namo nuotrauką ir pamatykite, kaip ji atrodytų papuošta Kalėdinėmis lemputėmis dar prieš montavimą. Aukščiausios kokybės Kalėdinių lempučių parduotuvė ir profesionalaus montavimo paslauga Lietuvoje.",
  keywords: [
    "Kalėdinės lemputės",
    "Kalėdinė puošyba",
    "namų puošimas",
    "Kalėdinių lempučių montavimas",
    "AI vizualizacija",
    "Vilnius",
    "Lietuva",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
