var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// Most of the config was copied from js-ipfs-api's webpack configuration

module.exports = {
  entry: './webapp/app.jsx',
  debug: true,
  output: {
    path: path.join(__dirname,'webapp','dist'),
    filename: 'app.js'
  },
  resolve: {
    modulesDirectories: [
      'node_modules', './webapp/', 'lib',
      'node_modules/font-awesome/css', 'node_modules/font-awesome/fonts'
    ],
    alias: {
      http: 'stream-http',
      https: 'https-browserify'
    }
  },
  module: {
    loaders: [
      { test: /\.(ttf|eot|svg|woff(2?))(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.css$/, loaders: ['style','css'] },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015','react'],
          plugins: ['transform-runtime']
        }
      },{
        test: /\.js$/,
        include: /node_modules\/(ipfs-api|hoek|qs|boom|wreck)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  externals: {
    fs: '{}'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Boards',
      template: 'webapp/template.html',
      inject: 'body'
    }),
    // Optimization
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ]
}
