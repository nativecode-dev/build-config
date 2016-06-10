module.exports = core => {
  const load = (filename, cwd) => {
    cwd = cwd || process.cwd()
    filename = core.path.join(cwd, filename)
    if (process.env.debug) {
      core.debug('Reading configuration %s.', filename)
    }
    return core.config(filename)
  }

  // Loads the default configuration so we have sane defaults.
  const coreconfig = load('defaults.json', __dirname)

  // Fix sources to ensure that they are always arrays.
  Object.keys(coreconfig.common.sources).map(key => {
    const value = coreconfig.common.sources[key]
    coreconfig.common.sources[key] = core.array(value)
  })

  // Apply secrets to the default configuration.
  coreconfig.options.secrets = core.secrets()

  return filename => {
    const userconfig = filename && core.exists(filename) ? load(filename) : {}
    return core.merge({}, coreconfig, userconfig)
  }
}
