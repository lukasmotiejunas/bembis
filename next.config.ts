import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Old English addresses → Lithuanian ones (permanent, so search engines move rankings over).
    return [
      { source: "/installation", destination: "/montavimas", permanent: true },
      { source: "/shop", destination: "/kaledines-lemputes", permanent: true },
      {
        source: "/shop/:slug",
        destination: "/kaledines-lemputes/:slug",
        permanent: true,
      },
      { source: "/rent", destination: "/nuoma", permanent: true },
      { source: "/contact", destination: "/kontaktai", permanent: true },
      {
        source: "/kaledines-lemputes/siltos-baltos-filamentines-c9",
        destination: "/kaledines-lemputes",
        permanent: true,
      },
      {
        source: "/kaledines-lemputes/spalvotos-c9",
        destination: "/kaledines-lemputes",
        permanent: true,
      },
      // Helovyno dekoracijos nebeparduodamos (2026-10-18). Laikinas nukreipimas, nes kitą sezoną jos gali grįžti.
      { source: "/helovyno-dekoracijos", destination: "/kaledines-lemputes", permanent: false },
      { source: "/helovyno-dekoracijos/:slug", destination: "/kaledines-lemputes", permanent: false },
    ];
  },
};

export default nextConfig;
