var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// Most of the config was copied from js-ipfs-api's webpack configuration

var config = {
  entry: path.join(__dirname, 'webapp', 'app.jsx'),
  output: {
    path: path.join(__dirname, 'webapp', 'dist'),
    filename: 'app.js'
  },
  resolve: {
    modulesDirectories: [
      'node_modules', './webapp/', 'lib', './webapp/components/', './webapp/assets/',
      './webapp/pages/', 'node_modules/font-awesome/css', 'node_modules/font-awesome/fonts'
    ],
    alias: {
      http: 'stream-http',
      https: 'https-browserify'
    }
  },
  eslint: {
    configFile: './.eslintrc',
    failOnWarning: true,
    failOnError: true,
    fix: true
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      { test: /\.(ttf|eot|svg|woff(2?))(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.css$/, loaders: ['style', 'css'] },
      { test: /\.md$/, loaders: ['html', 'markdown'] },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: addTransformRuntime([])
        }
      },
      {
        test: /\.js$/,
        include: /node_modules(\\|\/)(ipfs-api|hoek|qs|boom|wreck)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: addTransformRuntime([])
        }
      }
    ]
  },
  externals: {
    net: '{}',
    fs: '{}',
    tls: '{}',
    console: '{}',
    'require-dir': '{}'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Boards',
      template: 'webapp/index.html',
      inject: 'body'
    }),
    // Optimization
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}

config.devServer = {
  // webpack-dev-server -w --progress --devtool eval --port 9090 --quiet --content-base ./webapp/dist
  watch: true,
  progress: true,
  debug: true,
  devtool: 'eval-source',
  port: 9090,
  noInfo: true,
  colors: true,
  inline: true,
  contentBase: config.output.path
}

function addTransformRuntime (l) {
  if (process.env.os !== 'Windows_NT') {
    // Workaround for babel6 bug on windows
    // https://phabricator.babeljs.io/T6670
    // https://phabricator.babeljs.io/T2954
    // Disabling uglify on windows does the trick
    return l.concat('transform-runtime')
  }
  return l
}

module.exports = config
