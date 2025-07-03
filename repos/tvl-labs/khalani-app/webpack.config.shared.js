const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const createSharedConfig = (baseDir) => ({
  resolve: {
    alias: {
      '@assets': path.resolve(baseDir, 'public/'),
      '@components': path.resolve(baseDir, 'src/components/'),
      '@config': path.resolve(baseDir, 'src/config.ts'),
      '@containers': path.resolve(baseDir, 'src/containers/'),
      '@constants': path.resolve(baseDir, 'src/constants/'),
      '@dataSource': path.resolve(baseDir, 'src/dataSource/'),
      '@interfaces': path.resolve(baseDir, 'src/interfaces/'),
      '@messages': path.resolve(baseDir, 'src/messages/'),
      '@pages': path.resolve(baseDir, 'src/pages/'),
      '@store': path.resolve(baseDir, 'src/store/'),
      '@styles': path.resolve(baseDir, 'src/styles/'),
      '@tests': path.resolve(baseDir, 'testUtils/'),
      '@utils': path.resolve(baseDir, 'src/utils/'),
      '@modules': path.resolve(baseDir, 'src/modules/'),
      '@libs': path.resolve(baseDir, 'src/libs/'),
      '@hooks': path.resolve(baseDir, 'src/hooks/'),
      '@shared': path.resolve(baseDir, '../../shared/'),
      '@tanstack/react-query': path.resolve(
        __dirname,
        './node_modules/@tanstack/react-query',
      ),
    },
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      child_process: false,
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
      zlib: require.resolve('browserify-zlib'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(baseDir, 'src/index.template.html'),
      favicon: path.resolve(baseDir, '../../public/favicon.ico'),
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      'process.env.TYPE': JSON.stringify(process.env.TYPE),
      'process.env.NETWORK': JSON.stringify(process.env.NETWORK),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(baseDir, '../../tsconfig.build.json'),
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
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
})

module.exports = createSharedConfig
