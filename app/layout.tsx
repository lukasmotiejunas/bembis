import type { Metadata } from "next";
import { Manrope, Rubik_Wet_Paint } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileContactBar from "@/components/MobileContactBar";
import CartHydration from "@/components/CartHydration";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import LuckyWheel from "@/components/wheel/LuckyWheel";
import { SiteThemeProvider } from "@/components/SiteTheme";
import { site } from "@/lib/site";
import { getSiteTheme } from "@/lib/themeStore";
import { discountsEnabled } from "@/lib/discount";

// Self-hosted as one file: Google's split version renders "ū" with the macron over the next letter
// ("Jūs" looked like "Juš"). Fraunces (SIL OFL), Latin + Latin Extended-A, axes opsz/wght/SOFT.
const fraunces = localFont({
  src: "./fonts/Fraunces.woff2",
  weight: "100 900",
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
});

// Halloween headings. Not preloaded: the file is fetched only while the Halloween design is on.
const wetPaint = Rubik_Wet_Paint({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-wet-paint",
  preload: false,
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
    "kalėdinių lempučių montavimas Vilniuje",
    "kalėdinių girliandų montavimas",
    "kalėdinių lempučių kabinimas",
    "namo puošimas Kalėdoms",
    "kalėdinio apšvietimo montavimas",
    "kalėdinis namo apšvietimas",
    "kalėdinių lempučių nuoma Vilniuje",
    "kalėdinių girliandų nuoma",
    "lauko girliandų nuoma",
    "lauko kalėdinės lemputės",
  ],
  openGraph: {
    type: "website",
    locale: "lt_LT",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: true, email: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Chosen in /admin. The CSS for the Halloween design is keyed on this attribute (app/halloween.css).
  const theme = await getSiteTheme();
  return (
    <html lang="lt" data-theme={theme} className={`${fraunces.variable} ${manrope.variable} ${wetPaint.variable}`}>
      <body className="pb-20 md:pb-0">
        <SiteThemeProvider theme={theme}>
          <CartHydration />
          <TopBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileContactBar />
          <LuckyWheel enabled={discountsEnabled()} />
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""} hostname={new URL(site.url).hostname} />
        </SiteThemeProvider>
      </body>
    </html>
  );
}
