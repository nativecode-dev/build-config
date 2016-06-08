const defaults = {
  common: {
    dest: 'dist',
    key: {
      private: undefined,
      public: undefined
    },
    sources: {
      css: ['src/**/*.css'],
      html: ['src/**/*.html'],
      less: ['src/**/*.less'],
      javascript: ['src/**/*.js'],
      js: ['src/**/*.js'],
      sass: ['src/**/*.sass', 'src/**/*.scss'],
      ts: ['src/**.*.ts'],
      typescript: ['src/**.*.ts']
    }
  },
  options: {
    default: true,
    deploy: {},
    overrides: {
      names: {
        build: 'build',
        clean: 'clean',
        deploy: 'deploy',
        package: 'package',
        watch: 'watch'
      }
    },
    package: {
      shrinkwrap: {
        enabled: true,
        src: ['bower.json', 'package.json']
      }
    },
    watch: {
      configurations: {
        enabled: true,
        src: ['bower.json', 'gulpfile.js', 'gulpfile.json', 'package.json']
      }
    }
  }
}

module.exports = core => {
  return config => {
    const common = core.merge({}, defaults.common, config.common)
    const options = core.merge({}, defaults.options, config.options)
    const names = core.merge({}, defaults.options.overrides.names, options.overrides.names)

    const configuration = {
      builds: {},
      common: common,
      options: options,
      names: names,
      sites: {},
      watches: {}
    }

    const source = src => {
      if (!src) return []
      if (typeof src === 'array' && src.length) return src
      if (typeof src === 'function') return src()
      if (typeof src === 'string' && common.sources[src]) return common.sources[src]
      return undefined
    }

    const task = (key, value) => {
      const name = core.taskname(names.build, key)
      return configuration.builds[name] = {
        build: value.build || value,
        source: core.array(source(key) || source(value.src)),
        target: value.dest || common.dest
      }
    }

    const watch = (key, value) => {
      const name = core.taskname(names.watch, key)
      return configuration.watches[name] = {
        source: core.array(source(key) || source(value.src)),
        target: value.dest || common.dest
      }
    }

    const definitions = Object.keys(config).filter(key => ['common', 'options'].indexOf(key) < 0)
    definitions.map(key => configuration.builds[key] = task(key, config[key]))
    definitions.map(key => configuration.watches[key] = watch(key, config[key]))

    return configuration
  }
}
