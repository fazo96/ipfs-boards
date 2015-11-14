var gulp = require('gulp')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var minifyCss = require('gulp-minify-css')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var clean = require('gulp-clean')
var exorcist = require('exorcist')
var connect = require('gulp-connect')

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
  gulp.src(config.files.html)
      .pipe(gulp.dest(config.dest))
      .pipe(connect.reload())
})

gulp.task('js',function(){
  browserify(config.files.mainJs, { debug: true })
      .transform('babelify', {
        global: true,
        presets: [ 'es2015', 'react' ],
        ignore: /buffer|EventEmitter/
      })
      .transform('eslintify')
      .transform({ global: true },'uglifyify')
      .bundle()
      .pipe(exorcist(__dirname+'/webapp/dist/app.js.map'))
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
  gulp.watch(config.files.jsLibs,['js'])
  gulp.watch(config.files.html,['html'])
  gulp.watch(config.files.css,['css'])
})

gulp.task('serve', [ 'html', 'css', 'js', 'watch', 'server' ])

gulp.task('default', [ 'html', 'css', 'js' ])
