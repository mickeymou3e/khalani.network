const path = require('path')
const webpack = require('webpack')
require('dotenv').config()
const HtmlWebpackPlugin = require('html-webpack-plugin')

const paths = {
  src: path.resolve(__dirname, './src'),
  build: path.resolve(__dirname, './dist'),
  public: path.resolve(__dirname, './public'),
}

module.exports = {
  entry: './src/index.tsx',
  plugins: [
    new HtmlWebpackPlugin({
      template: `${paths.src}/index.html`,
      favicon: `${paths.public}/favicon.ico`,
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      'process.env.APP_ENVIRONMENT': JSON.stringify(
        process.env.APP_ENVIRONMENT,
      ),
      'process.env.CONTRACTS_CONFIG': JSON.stringify(
        process.env.CONTRACTS_CONFIG,
      ),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.build.json',
        },
      },
      {
        test: /\.(png|woff2|ttf|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'public/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@containers': path.resolve(__dirname, 'src/containers/'),
      '@config': path.resolve(__dirname, 'config.json'),
      '@constants': path.resolve(__dirname, 'src/constants/'),
      '@graph': path.resolve(__dirname, 'src/graph/'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces/'),
      '@store': path.resolve(__dirname, 'src/store/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
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
