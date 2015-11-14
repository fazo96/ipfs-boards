var gulp = require('gulp')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var minifyCss = require('gulp-minify-css')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var clean = require('gulp-clean')
var connect = require('gulp-connect')

var config = {
  files: {
    mainJs: 'webapp/app.jsx',
    css: 'webapp/*.css',
    js: ['webapp/*.js','webapp/*.jsx'],
    html: 'webapp/*.html'
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
  gulp.src(config.files.html)
      .pipe(gulp.dest(config.dest))
      .pipe(connect.reload())
})

gulp.task('js',function(){
  browserify(config.files.mainJs)
      .transform('babelify', { presets: [ 'es2015', 'react' ]})
      .transform('eslintify')
      .bundle()
      .on('error', console.error.bind(console))
      .pipe(source('app.js')) // do this or browserify won't work
      .pipe(buffer()) // do this or uglify won't work
      //.pipe(uglify())
      .pipe(gulp.dest(config.dest))
      .pipe(connect.reload())
})



gulp.task('clean',function(){
  gulp.src(config.dest, { read: false })
      .pipe(clean())
})

gulp.task('server',function(){
  connect.server({
    root: config.dest,
    port: 9090,
    livereload: true
  })
})

gulp.task('watch',function(){
  gulp.watch(config.files.js,['js'])
  gulp.watch(config.files.html,['html'])
  gulp.watch(config.files.css,['css'])
})

gulp.task('serve', [ 'html', 'css', 'js', 'watch', 'server' ])

gulp.task('default', [ 'html', 'css', 'js' ])
