require('dotenv').config()

const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const paths = {
  src: path.resolve(__dirname, './src'),
  build: path.resolve(__dirname, './dist'),
  public: path.resolve(__dirname, './public'),
}

module.exports = {
  entry: `${paths.src}/index.tsx`,
  plugins: [
    new HtmlWebpackPlugin({
      template: `${paths.src}/index.template.html`,
      favicon: `${paths.public}/favicon.ico`,
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
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
        test: /\.(png|woff2|ttf|jpe?g|gif|ico)$/i,
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
      '@components': path.resolve(__dirname, 'src/components/'),
      '@config': path.resolve(__dirname, 'src/config.ts'),
      '@containers': path.resolve(__dirname, 'src/containers/'),
      '@constants': path.resolve(__dirname, 'src/constants/'),
      '@enums': path.resolve(__dirname, 'src/enums/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@modules': path.resolve(__dirname, 'src/modules/'),
      '@services': path.resolve(__dirname, 'src/services/'),
    },
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      fs: false,
      crypto: false,
      path: require.resolve('path-browserify'),
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
    filename: '[name].bundle.js',
    path: paths.build,
  },
}
