const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()

const $ = require('./gulpfile.config.js')

gulp.task('build', ['build:js', 'build:json'])

gulp.task('build:js', () => {
  return gulp.src($.sources.js)
    .pipe(plugins.debug($.debug.js))
    .pipe(plugins.babel($.plugins.babel))
    .pipe(gulp.dest($.destination.lib))
})

gulp.task('build:json', () => {
  return gulp.src($.sources.json)
    .pipe(gulp.dest($.destination.lib))
})

gulp.task('clean', ['clean:js'])

gulp.task('clean:js', () => {
  return gulp.src($.destination.lib)
    .pipe(plugins.clean())
})

gulp.task('test', ['build'], () => {
  return gulp.src($.sources.tests)
    .pipe(plugins.mocha($.plugins.mocha))
})

gulp.task('default', ['build'])