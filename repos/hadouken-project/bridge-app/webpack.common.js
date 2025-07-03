const path = require('path')
require('dotenv').config()

// Fallback added because of nervos-integration packages
const paths = {
  src: path.resolve(__dirname, './src'),
  build: path.resolve(__dirname, './dist'),
  public: path.resolve(__dirname, './public'),
}

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'public/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@containers': path.resolve(__dirname, 'src/containers/'),
      '@config': path.resolve(__dirname, 'src/config.ts'),
      '@constants': path.resolve(__dirname, 'src/constants/'),
      '@graph': path.resolve(__dirname, 'src/graph/'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces/'),
      '@store': path.resolve(__dirname, 'src/store/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@tests': path.resolve(__dirname, 'testUtils/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
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
      assert: require.resolve('assert/'),
    },
  },
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: paths.build,
  },
}
