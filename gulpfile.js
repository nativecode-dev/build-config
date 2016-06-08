const gulp = require('gulp-build-tasks')(require('gulp'))
const plugin = require('gulp-load-plugins')()

const $ = gulp.bt.config

gulp.bt.build({
  js: {
    build: stream => stream
      .pipe(plugin.babel($.babel))
      .pipe(gulp.dest('dist')),
    src: ['src/**/*.js']
  }
})

gulp.bt.reload('test').when({
  'src/**/*.js': ['test'],
  'test/**/*.js': ['test']
})

gulp.bt.publish({ tasks: ['test']}).npm()

gulp.task('default', ['build'])

gulp.task('test', ['build'], () => {
  return gulp.src('test/**/*.js', {read: false})
    .pipe(plugin.mocha({reporter: 'nyan'}))
})
