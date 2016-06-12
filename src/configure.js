module.exports = (core, adapter) => {
  core.require(adapter)
  adapter.reserved = adapter.reserved || ['common', 'options', 'plugins']

  const loader = require('./conf.js')(core)

  return definition => {
    core.require(definition)
    const defaults = core.merge(true, loader(core.array(adapter.configfile)), { common: { debug: !!process.env.debug } })
    const configuration = {
      builds: {},
      watches: {}
    }

    // Map reserved keywords array and merge as maps on the config.
    Object.keys(adapter.reserved).map(index => {
      const key = adapter.reserved[index]
      configuration[key] = core.merge(true, defaults[key] || {}, definition[key] || {})
    })

    const common = configuration.common
    const names = configuration.common.names

    const dependencies = tasks => {
      tasks = core.array(tasks)
      return Object.keys(tasks).map(index => {
        const key = tasks[index]
        return definition[key] ? core.taskname(names.build, key) : key
      })
    }

    const destination = dest => {
      if (dest === false) return null
      if (!dest) return common.dest
      if (core.is.func(dest)) return dest()
      if (core.is.string(dest)) return common.destinations[dest] ? common.destinations[dest] : dest
      if (core.is.array(dest)) return dest[0]
      return dest
    }

    const source = (src, defaultValue) => {
      if (!src) return []
      if (core.is.func(src)) return src()
      if (core.is.string(src) && common.sources[src]) return common.sources[src]
      if (core.is.array(src)) return src
      return defaultValue ? src : null
    }

    const task = (key, value) => {
      const name = core.taskname(names.build, key)
      const conf = configuration.builds[key] = {
        build: value.build || value,
        dependencies: dependencies(value.tasks),
        name: name,
        source: core.array(source(key) || source(value.src, true)),
        target: destination(value.dest)
      }
      return conf
    }

    const watch = (key, value) => {
      const conf = configuration.watches[key] = {
        dependencies: [core.taskname(names.build, key)],
        name: core.taskname(names.watch, key),
        source: core.array(source(key) || source(value.src, true))
      }
      return conf
    }

    const definitions = Object.keys(definition).filter(key => adapter.reserved.indexOf(key) < 0)
    definitions.map(key => task(key, definition[key]))
    definitions.map(key => watch(key, definition[key]))

    return configuration
  }
}
