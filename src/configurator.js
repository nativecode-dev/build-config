module.exports = (core, adapter) => {
  core.require(adapter)
  const loader = require('./conf.js')(core)

  return config => {
    core.require(config)
    const defaults = core.merge(true, loader(adapter.configfile), { common: { debug: !!process.env.debug } })

    const common = core.merge(true, defaults.common, config.common)
    const options = core.merge(true, defaults.options, config.options)
    const names = core.merge(true, defaults.options.overrides.names, options.overrides.names)

    const configuration = {
      common: common,
      options: options,

      builds: {},
      deployments: {},
      packages: {},
      watches: {}
    }

    const dependencies = tasks => {
      tasks = core.array(tasks)
      return Object.keys(tasks).map(index => {
        const key = tasks[index]
        return config[key] ? core.taskname(names.build, key) : key
      })
    }

    const destination = dest => {
      if (dest === false) return null
      if (!dest) return common.dest
      if (core.is.func(dest)) return dest()
      if (core.is.string(dest) && common.desinations[dest]) return common.destinations[dest]
      return dest
    }

    const source = src => {
      if (!src) return []
      if (core.is.func(src)) return src()
      if (core.is.string(src) && common.sources[src]) return common.sources[src]
      return Object.keys(src).map(key => source(src[key]))
    }

    const task = (key, value) => {
      const name = core.taskname(names.build, key)
      const conf = configuration.builds[key] = {
        build: value.build || value,
        dependencies: dependencies(value.tasks),
        name: name,
        source: core.array(source(key) || source(value.src)),
        target: destination(value.dest)
      }
      return conf
    }

    const watch = (key, value) => {
      const conf = configuration.watches[key] = {
        dependencies: [core.taskname(names.build, key)],
        name: core.taskname(names.watch, key),
        source: core.array(source(key) || source(value.src))
      }
      return conf
    }

    const definitions = Object.keys(config).filter(key => ['common', 'options', 'plugins'].indexOf(key) < 0)
    definitions.map(key => task(key, config[key]))
    definitions.map(key => watch(key, config[key]))

    return configuration
  }
}
