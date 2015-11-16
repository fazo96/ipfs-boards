var gulp = require('gulp')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var minifyCss = require('gulp-minify-css')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var clean = require('gulp-clean')
var exorcist = require('exorcist')
var connect = require('gulp-connect')
var watchify = require('watchify')
var util = require('gulp-util')

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

gulp.task('css',function(){
  gulp.src(config.files.css)
      .pipe(minifyCss())
      .pipe(gulp.dest(config.dest))
      .pipe(connect.reload())
})

gulp.task('html',function(){
  return gulp.src(config.files.html)
      .pipe(gulp.dest(config.dest))
      .pipe(connect.reload())
})

gulp.task('js-watch',function(){
  var b = getBrowserify()
  b.on('log',function(l){
    util.log(l)
  })
  b.on('error',function(error){
    util.log(error)
  })
  b.on('update', function(){
    util.log('Rebundling')
    applyBrowserify(b)
  })
  return applyBrowserify(b)
})

gulp.task('js',function(){
  return applyBrowserify(getBrowserify())
})

function getBrowserify(){
  return browserify(config.files.mainJs, {
    cache: {},
    packageCache: {},
    plugin: [watchify],
    //fullPaths: true,
    debug: true })
        .transform('babelify', {
          global: true,
          presets: [ 'es2015', 'react' ],
          ignore: /buffer|EventEmitter/
        })
        .transform('eslintify')
        .transform({ global: true },'uglifyify')
}

function applyBrowserify(b){
  return b.bundle()
  .pipe(exorcist(__dirname+'/webapp/dist/app.js.map'))
  .on('error', console.error.bind(console))
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(gulp.dest(config.dest))
  .pipe(connect.reload())
}

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

gulp.task('watch',['js-watch'],function(){
  //gulp.watch([config.files.jsLibs,config.files.mainJs],['js-watch'])
  gulp.watch(config.files.html,['html'])
  gulp.watch(config.files.css,['css'])
})

gulp.task('serve', [ 'html', 'css', 'watch', 'server' ])

gulp.task('default', [ 'html', 'css', 'js' ])
