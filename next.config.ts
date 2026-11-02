import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/vietnam/overview", destination: "/vietnam", permanent: true }];
  },
};

export default nextConfig;
