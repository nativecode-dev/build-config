const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()

const $ = require('gulp-configly')(__dirname, 'package.json')

gulp.task('build', ['build:js', 'build:json'])

gulp.task('build:js', ['lint:js'], () => {
  return gulp.src($.sources.js)
    .pipe(plugins.debug($.debug.js))
    .pipe(plugins.babel($.plugins.babel))
    .pipe(gulp.dest($.destination.lib))
})

gulp.task('build:json', () => {
  return gulp.src($.sources.json)
    .pipe(plugins.debug($.debug.json))
    .pipe(gulp.dest($.destination.lib))
})

gulp.task('clean', () => {
  return gulp.src($.destination.lib)
    .pipe(plugins.debug($.debug.js))
    .pipe(plugins.clean())
})

gulp.task('lint:js', () => {
  return gulp.src($.sources.js)
    .pipe(plugins.debug($.debug.js))
    .pipe(plugins.standard())
    .pipe(plugins.standard.reporter('default', $.plugins.standard))
})

gulp.task('test', ['build'], () => {
  return gulp.src($.sources.tests)
    .pipe(plugins.mocha($.plugins.mocha))
})

gulp.task('default', ['build'])
