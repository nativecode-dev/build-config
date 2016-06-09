module.exports = (core, adapter) => {
  const coreconfig = core.config(core.path.join(__dirname, 'defaults.json'))

  return config => {
    const userconfig = adapter && core.exists(adapter.configfile) ? core.config(adapter.configfile) : {}
    const defaults = core.merge({}, coreconfig, userconfig)

    const common = core.merge({}, defaults.common, config.common)
    const options = core.merge({}, defaults.options, config.options)
    const names = core.merge({}, defaults.options.overrides.names, options.overrides.names)

    const configuration = {
      common: common,
      options: options,

      builds: {},
      deployments: {},
      packages: {},
      watches: {}
    }

    const destination = dest => {
      if (!dest) return common.dest
      if (typeof dest === 'function') return dest()
      if (typeof dest === 'string' && common.desinations[dest]) return common.destinations[dest]
      return dest
    }

    const source = src => {
      if (!src) return []
      if (typeof src === 'function') return src()
      if (typeof src === 'string' && common.sources[src]) return common.sources[src]
      return src
    }

    const task = (key, value) => {
      const name = core.taskname(names.build, key)
      const conf = configuration.builds[key] = {
        build: value.build || value,
        name: name,
        source: core.array(source(key) || source(value.src)),
        target: destination(value.dest)
      }
      return conf
    }

    const watch = (key, value) => {
      const name = core.taskname(names.watch, key)
      const conf = configuration.watches[key] = {
        name: name,
        source: core.array(source(key) || source(value.src)),
        target: destination(value.dest)
      }
      return conf
    }

    const definitions = Object.keys(config).filter(key => ['common', 'options', 'plugins'].indexOf(key) < 0)
    definitions.map(key => task(key, config[key]))
    definitions.map(key => watch(key, config[key]))

    return configuration
  }
}
