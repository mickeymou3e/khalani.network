const { merge } = require('webpack-merge')
const path = require('path')
const common = require('./webpack.config.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      publicPath: '/',
      directory: path.resolve(__dirname, 'src'),
    },
    proxy: {
      '/api/monitorMinting': {
        target: 'https://worker.khalani.network',
        changeOrigin: true,
        secure: false,
        onProxyReq(proxyReq, req, res) {
          console.log('[MINT] Proxy request:', req.url, ' -> ', proxyReq.path)
        },
      },
      '/api/deposits': {
        target: 'https://worker.khalani.network',
        changeOrigin: true,
        secure: false,
        onProxyReq(proxyReq, req, res) {
          console.log(
            '[DEPOSITS] Proxy request:',
            req.url,
            ' -> ',
            proxyReq.path,
          )
        },
      },
      '/api': {
        target: 'https://medusa.khalani.network',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '' },
        onProxyReq(proxyReq, req, res) {
          console.log(`Proxying request to: ${proxyReq.path}`)
        },
        onProxyRes(proxyRes, req, res) {
          console.log(`Received response: ${proxyRes.statusCode}`)
        },
      },
    },
    historyApiFallback: true,
    hot: true,
  },
})
