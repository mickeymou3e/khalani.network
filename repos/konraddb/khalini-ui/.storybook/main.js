const path = require('path')

module.exports = {
  core: {
    builder: 'webpack5',
  },
  features: { emotionAlias: false },
  typescript: {
    check: false,
    checkOptions: {
      typescript: {
        tsconfig: `${path.join(__dirname, '../')}/tsconfig.build.json`,
      },
    },
  },
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: async (config) => {
    const rootPath = path.join(__dirname, '../')
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test.test('.svg'),
    )
    fileLoaderRule.exclude = /\.svg$/
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    })

    config.resolve.fallback = {
      ...config.resolve.fallback ,
      "child_process": false,
      "fs": false,
      "http": false,
      "https": false,
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(rootPath, 'src/components/'),
      '@interfaces': path.resolve(rootPath, 'src/interfaces/'),
      '@styles': path.resolve(rootPath, 'src/styles/'),
      '@tests': path.resolve(rootPath, 'testUtils/'),
      '@utils': path.resolve(rootPath, 'src/utils/'),
    }
    return config
  },
}
