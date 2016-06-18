const gulp = require('gulp-build-tasks')(require('gulp'))
const plugin = require('gulp-load-plugins')()

const $ = gulp.bt.config

const tsconfig = plugin.typescript.createProject({
  module: 'commonjs',
  moduleResolution: 'node',
  target: 'es5'
})

plugin.teamcityReporter.wireTaskEvents()

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
  },
  ts: {
    build: stream => stream
      .pipe(plugin.typescript(tsconfig))
      .pipe(gulp.dest('dist')),
    src: ['src/**/*.ts'],
    tasks: ['build:tslint']
  },
  tslint: {
    build: stream => stream
      .pipe(plugin.tslint()),
    src: ['src/**/*.ts']
  }
})

gulp.bt.reload('test').when({
  'src/**/*.js': ['test'],
  'src/**/*.json': ['test'],
  'src/v2/**/*.ts': ['test'],
  'test/**/*.js': ['test']
})

gulp.bt.publish({ tasks: ['test']}).npm()

gulp.task('clean', () => gulp.src($.clean.src).pipe(plugin.clean()))
gulp.task('default', ['test'])

gulp.task('test', ['build:js', 'build:ts'], () => {
  return gulp.src('test/**/*.js', {read: false})
    .pipe(plugin.debug({title: 'tests:'}))
    .pipe(plugin.mocha({reporter: process.env['TEAMCITY_AGENT_NAME'] ? 'mocha-teamcity-reporter' : 'nyan'}))
})
