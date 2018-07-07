const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    main: ['@babel/polyfill', 'react-hot-loader/patch', './src/client.js']
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false
        },
        ie8: false,
        mangle: {
          keep_fnames: true
        },
        compress: {
          keep_fnames: true
        }
      }
    })
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'client'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          plugins: [
            'react-hot-loader/babel'
          ],
          presets: [
            '@babel/preset-flow',
            '@babel/preset-react',
            [
              '@babel/preset-stage-0',
              {
                decoratorsLegacy: true,
                pipelineProposal: 'minimal'
              }
            ],
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: ['last 2 versions', 'safari >= 7']
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.graphql$/,
        loader: 'graphql-tag/loader'
      },
      {
        test: /\.(svg|woff|woff2|png|eot|ttf)$/,
        loader: 'file-loader'
      }
    ]
  }
}
