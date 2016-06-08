const core = require('./core.js')
const configurator = require('./configurator.js')(core)
const nosupport = method => {
  throw new Error('Method ' + method + 'not supported.')
}

module.exports = (definition, methods) => {
  const api = {}
  const configuration = configurator(definition)

  const define = method => {
    return () => {
      if (methods[method]) {
        methods[method](configuration)
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
