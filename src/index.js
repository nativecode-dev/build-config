const core = require('./core.js')
const configure = require('./configure.js')

const defadapter = {
  configfile: undefined,
  methods: {}
}

const nosupport = method => {
  throw new Error('Method ' + method + ' not supported.')
}

module.exports = (definition, adapter) => {
  adapter = core.merge(true, defadapter, adapter)

  const api = {}

  // Create configuration instance from definition.
  const configuration = configure(core, adapter)(definition, adapter)

  const define = method => {
    return options => {
      if (adapter.methods[method]) {
        const results = adapter.methods[method](configuration, options)
        const dependencies = core.array(results)

        dependencies.map(index => {
          const name = dependencies[index]
          if (!adapter[name] || !core.is.func(adapter[name])) {
            throw new Error('Dependency ' + name + ' required but was not enabled.')
          }
        })
      } else {
        nosupport(method)
      }
      return api
    }
  }

  const methods = core.merge(true, configuration.common.names, adapter.methods)
  Object.keys(methods).map(name => {
    if (!api[name]) {
      api[name] = define(name)
    }
  })

  return api
}

module.exports.core = core
