/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      unoptimized: true,
    },
    transpilePackages: ['@hadouken-project/ui'],
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
  }
  

module.exports = nextConfig
