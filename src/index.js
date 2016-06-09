const core = require('./core.js')
const configure = require('./configurator.js')(core)

const defadapter = {
  configfile: undefined,
  methods: {}
}

const nosupport = method => {
  throw new Error('Method ' + method + ' not supported.')
}

module.exports = (definition, adapter) => {
  adapter = core.merge({}, defadapter, adapter)

  const api = {}
  const methods = adapter.methods

  // Create configuration instance from definition.
  const configuration = configure(definition, adapter)

  const define = method => {
    return options => {
      if (methods[method]) {
        methods[method](configuration, options)
      } else {
        nosupport(method)
      }
      return api
    }
  }

  api.build = define('build')
  api.clean = define('clean')
  api.deploy = define('deploy')
  api.package = define('package')
  api.publish = define('publish')
  api.watch = define('watch')

  return api
}

module.exports.core = core
