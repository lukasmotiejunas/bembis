import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Rental used to have its own page; it now lives on /shop next to the light for sale.
    return [{ source: "/rent", destination: "/shop#nuoma", permanent: false }];
  },
};

export default nextConfig;
