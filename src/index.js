const core = require('./core.js')
const configurator = require('./configurator.js')

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
  const configure = configurator(core, adapter)
  const configuration = configure(definition, adapter)

  const define = method => {
    return options => {
      if (adapter.methods[method]) {
        adapter.methods[method](configuration, options)
      } else {
        nosupport(method)
      }
      return api
    }
  }

  Object.keys(configuration.options.overrides.names)
    .map(name => {
      api[name] = define(name)
    })

  return api
}

module.exports.core = core
