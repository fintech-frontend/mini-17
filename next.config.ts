import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
  remotePatterns: [
    { protocol: "https", hostname: "yeteper714.pythonanywhere.com" },
  ],
},
};

export default nextConfig;
