import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

const basePath = isGithubPages && repoName ? `/${repoName}` : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NODE_ENV === "production",
  typedRoutes: false,

  // Static export only for GitHub Pages; Cloud Run uses server mode.
  output: isGithubPages ? "export" : undefined,

  // Safer for GitHub Pages nested routes
  trailingSlash: true,

  // Required if you use next/image
  images: {
    unoptimized: true,
  },

  ...(basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`,
      }
    : {}),
};

export default withNextIntl(nextConfig);