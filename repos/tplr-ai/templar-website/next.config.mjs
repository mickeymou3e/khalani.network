/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    quietDeps: true,
    silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin', 'legacy-js-api', 'color-functions', 'mixed-decls'],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: false,
          },
        },
      ],
    })
    return config
  },
}

export default nextConfig
