var gulp = require('gulp')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var minifyCss = require('gulp-minify-css')
var browserify = require('browserify')
var reactify = require('reactify') // Transforms React JSX to JS
var uglify = require('gulp-uglify')
var clean = require('gulp-clean')

var config = {
  files: {
    css: 'webapp/*.css',
    js: 'webapp/*.js',
    html: 'webapp/*.html',
    mainJs: 'webapp/app.js'
  },
  dest: 'webapp/dist/'
}

config.browserify = browserify({
  entries: config.files.mainJs,
  transform: [ reactify  ]
})

gulp.task('css',function(){
  gulp.src(config.files.css)
      .pipe(minifyCss())
      .pipe(gulp.dest(config.dest))
})

gulp.task('html',function(){
  gulp.src(config.files.html)
      .pipe(gulp.dest(config.dest))
})

gulp.task('js',function(){
  config.browserify.bundle()
      .on('error', console.error.bind(console))
      .pipe(source('app.js')) // do this or browserify won't work
      .pipe(buffer()) // do this or uglify won't work
      .pipe(uglify())
      .pipe(gulp.dest(config.dest))
})

gulp.task('clean',function(){
  gulp.src(config.dest, { read: false })
      .pipe(clean())
})

gulp.task('watch',function(){
  gulp.watch(config.files.js,['js'])
  gulp.watch(config.files.html,['html'])
  gulp.watch(config.files.css,['css'])
})

gulp.task('default', [ 'html', 'css', 'js', 'watch' ])
