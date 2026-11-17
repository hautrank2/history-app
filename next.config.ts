import type { NextConfig } from "next";

import { threeKingdomsHref } from "./src/data/battle-links";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/vietnam/overview", destination: "/vietnam", permanent: true },
      { source: "/china/three-kingdoms", destination: threeKingdomsHref, permanent: true },
    ];
  },
};

export default nextConfig;
