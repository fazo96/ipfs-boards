var gulp = require('gulp')
var webpack = require('webpack-stream')
var clean = require('gulp-clean')
var connect = require('gulp-connect')
var ghPages = require('gulp-gh-pages')

var config = {
  files: {
    mainJs: 'webapp/app.jsx',
    css: 'webapp/*.css',
    js: ['webapp/*.js','webapp/*.jsx'],
    html: 'webapp/*.html',
    jsLibs: 'lib/*.js'
  },
  dest: 'webapp/dist/'
}

gulp.task('watch',['clean'],function(){
  var cfg = require('./webpack.config.js')
  cfg.watch = true
  cfg.devtool = 'eval'
  return gulp.src(config.files.mainJs)
    .pipe(webpack(cfg))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload())
})

gulp.task('build',['clean'],function(){
  return gulp.src(config.files.mainJs)
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(config.dest))
})

gulp.task('clean',function(){
  return gulp.src(config.dest, { read: false }).pipe(clean())
})

gulp.task('server',function(){
  connect.server({
    root: config.dest,
    port: 9090,
    livereload: true
  })
})

gulp.task('gh-pages',[ 'build' ],function(){
  gulp.src([config.dest+'*.js',config.dest+'*.css',config.dest+'*.html'])
    .pipe(ghPages())
})

gulp.task('serve', [ 'watch', 'server' ])

gulp.task('default', [ 'build' ])
