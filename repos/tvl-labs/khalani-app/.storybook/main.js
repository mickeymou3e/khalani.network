const path = require('path')

module.exports = {
  core: {
    builder: 'webpack5',
  },
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

    config.resolve.alias = {
      ...config.resolve.alias,
      '@assets': path.resolve(rootPath, 'public/'),
      '@components': path.resolve(rootPath, 'src/components/'),
      '@config': path.resolve(rootPath, 'src/config.ts'),
      '@containers': path.resolve(rootPath, 'src/containers/'),
      '@constants': path.resolve(rootPath, 'src/constants/'),
      '@interfaces': path.resolve(rootPath, 'src/interfaces/'),
      '@messages': path.resolve(rootPath, 'src/messages/'),
      '@pages': path.resolve(rootPath, 'src/pages/'),
      '@store': path.resolve(rootPath, 'src/store/'),
      '@styles': path.resolve(rootPath, 'src/styles/'),
      '@tests': path.resolve(rootPath, 'testUtils/'),
      '@utils': path.resolve(rootPath, 'src/utils/'),
      '@libs': path.resolve(rootPath, 'src/libs/'),
    }
    config.resolve.fallback = {
      fs: false,
      crypto: false,
      path: false,
      http: false,
      https: false,
      os: require.resolve('os-browserify/browser'),
      stream: require.resolve('stream-browserify'),
    }

    return config
  },
}
