require('dotenv').config()

const path = require('path')

const paths = {
  src: path.resolve(__dirname, './src'),
  build: path.resolve(__dirname, './dist'),
  public: path.resolve(__dirname, './public'),
}

module.exports = {
  entry: `${paths.src}/index.tsx`,
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'public/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@config': path.resolve(__dirname, 'src/config.ts'),
      '@containers': path.resolve(__dirname, 'src/containers/'),
      '@constants': path.resolve(__dirname, 'src/constants/'),
      '@dataSource': path.resolve(__dirname, 'src/dataSource/'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces/'),
      '@messages': path.resolve(__dirname, 'src/messages/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@store': path.resolve(__dirname, 'src/store/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@tests': path.resolve(__dirname, 'testUtils/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@modules': path.resolve(__dirname, 'src/modules/'),
    },
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      fs: false,
      crypto: false,
      path: require.resolve('path-browserify'),
      assert: require.resolve('assert'),
      os: require.resolve('os-browserify/browser'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      process: require.resolve('process/browser'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url/'),
      events: require.resolve('events/'),
    },
  },
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: paths.build,
  },
}
