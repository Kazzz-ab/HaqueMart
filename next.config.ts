import type { NextConfig } from "next";

const wpHostname = process.env.NEXT_PUBLIC_WP_HOSTNAME ?? "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // WordPress media uploads (set NEXT_PUBLIC_WP_HOSTNAME in .env.local)
      ...(wpHostname
        ? [{ protocol: "https" as const, hostname: wpHostname }]
        : []),
      // Curated demo/mock product & editorial photography
      { protocol: "https" as const, hostname: "images.unsplash.com" },
      { protocol: "https" as const, hostname: "picsum.photos" },
      { protocol: "https" as const, hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
