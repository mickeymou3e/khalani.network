/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const withPlugins = require('next-compose-plugins')
const withFonts = require('next-fonts')

const optimizedImages = require('next-optimized-images')

const withTM = require('next-transpile-modules')(['@hadouken-project/ui'])

module.exports = withTM((phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return defaultConfig
  }

  return withPlugins([
    [
      optimizedImages,
      {
        handleImages: ['jpeg', 'png', 'svg'],
        optimizeImagesInDev: false,
        pngquant: true,
        optipng: {
          optimizationLevel: 2,
        },
        responsive: {
          adapter: require('responsive-loader/sharp'),
        },
        withFonts,
      },
    ],
    {
      reactStrictMode: true,
      images: {
        loader: 'imgix',
        disableStaticImages: true,
        path: process.env.PUBLIC_PATH,
      },
    },
  ])
})
