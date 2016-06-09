const gulp = require('gulp-build-tasks')(require('gulp'))
const plugin = require('gulp-load-plugins')()

const $ = gulp.bt.config

gulp.bt.build({
  js: {
    build: stream => stream
      .pipe(plugin.babel($.babel))
      .pipe(gulp.dest('dist')),
    src: ['src/**/*.js'],
    tasks: ['build:jslint']
  },
  jslint: {
    build: stream => stream
      .pipe(plugin.standard())
      .pipe(plugin.standard.reporter('stylish', { breakOnError: false })),
    src: ['src/**/*.js'],
    tasks: ['build:json']
  },
  json: {
    build: stream => stream
      .pipe(gulp.dest('dist')),
    src: ['src/**/*.json']
  }
})

gulp.bt.reload('test').when({
  'src/**/*.js': ['test'],
  'src/**/*.json': ['test'],
  'test/**/*.js': ['test']
})

gulp.bt.publish({ tasks: ['test']}).npm()

gulp.task('clean', () => gulp.src($.clean.src).pipe(plugin.clean()))
gulp.task('default', ['test'])

gulp.task('test', ['build'], () => {
  return gulp.src('test/**/*.js', {read: false})
    .pipe(plugin.mocha({reporter: 'nyan'}))
})
