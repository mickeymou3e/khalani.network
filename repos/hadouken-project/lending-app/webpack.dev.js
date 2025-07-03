const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const paths = {
  src: path.resolve(__dirname, './src'),
  build: path.resolve(__dirname, './dist'),
  public: path.resolve(__dirname, './public'),
}
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: `${paths.src}/index.local.html`,
      favicon: `${paths.public}/favicon.ico`,
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      'process.env.CONFIG': JSON.stringify(process.env.CONFIG),
      'process.env.CONFIG_FRONT': JSON.stringify(process.env.CONFIG_FRONT),
      'process.env.BASENAME': JSON.stringify(process.env.BASENAME),
      'process.env.SENTRY': JSON.stringify(process.env.SENTRY),
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
  devServer: {
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    hot: true,
  },
})
