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
  json: {
    build: stream => stream
      .pipe(gulp.dest('dist')),
    src: ['lib/**/*.json']
  },
  ts: {
    build: stream => stream
      .pipe(plugin.typescript(tsconfig))
      .pipe(gulp.dest('dist')),
    src: ['lib/**/*.ts'],
    tasks: ['build:tslint']
  },
  tslint: {
    build: stream => stream
      .pipe(plugin.tslint()),
    src: ['lib/**/*.ts']
  }
})

gulp.bt.reload('test').when({
  'lib/**/*.js': ['test'],
  'lib/**/*.json': ['test'],
  'lib/v2/**/*.ts': ['test'],
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
