import type { NextConfig } from "next";

import { bachDangHref, dienBienPhuHref, threeKingdomsHref } from "./src/data/battle-links";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/vietnam/overview", destination: "/vietnam", permanent: true },
      { source: "/vietnam/bach-dang-1288", destination: bachDangHref, permanent: true },
      { source: "/battle/bach-dang-1288", destination: bachDangHref, permanent: true },
      { source: "/battle/dien-bien-phu", destination: dienBienPhuHref, permanent: true },
      { source: "/china/three-kingdoms", destination: threeKingdomsHref, permanent: true },
      { source: "/battle/three-kingdom", destination: threeKingdomsHref, permanent: true },
      { source: "/battle/three-kingdoms", destination: threeKingdomsHref, permanent: true },
    ];
  },
};

export default nextConfig;
