const core = require('./core.js')
const configurator = require('./configurator.js')(core)
const nosupport = () => {
  throw new Error('Method not supported.')
}

module.exports = (definition, methods) => {
  const api = {}
  const configuration = configurator(definition)

  const define = method => {
    if (methods[method]) {
      methods[method](configuration)
    } else {
      nosupport()
    }
    return api
  }

  api.build = define('build')
  api.deploy = define('deploy')
  api.package = define('package')
  api.watch = define('watch')

  return api
}
