import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NODE_ENV === "production",
  typedRoutes: false,
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);