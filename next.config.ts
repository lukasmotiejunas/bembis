import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Old English addresses → Lithuanian ones (permanent, so search engines move rankings over).
    return [
      { source: "/installation", destination: "/montavimas", permanent: true },
      { source: "/shop", destination: "/kaledines-lemputes", permanent: true },
      { source: "/shop/:slug", destination: "/kaledines-lemputes/:slug", permanent: true },
      { source: "/rent", destination: "/nuoma", permanent: true },
      { source: "/contact", destination: "/kontaktai", permanent: true },
    ];
  },
};

export default nextConfig;
