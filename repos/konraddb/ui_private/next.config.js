/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  i18n,
  distDir: "build",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/markets",
        permanent: true,
      },
      {
        source: "/trade",
        destination: `/trade/${process.env.NEXT_PUBLIC_DEFAULT_MARKET_BASE}_${process.env.NEXT_PUBLIC_DEFAULT_MARKET_QUOTE}`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
