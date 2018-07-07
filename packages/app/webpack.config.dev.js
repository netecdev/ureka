const conf = require('./webpack.config')
const webpack = require('webpack')
const config = require('config')
const path = require('path')
module.exports = {
  ...conf,
  mode: 'development',
  devtool: 'source-map',
  output: {
    publicPath: '/'
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ],
  devServer: {
    proxy: {
      '/': {
        target: `http://localhost:${config.port}`,
        changeOrigin: true
      }
    },
    contentBase: path.join(__dirname, 'dist', 'client'),
    port: config.port + 1,
    host: config.host
  }
}
