module.exports = core => {
  const load = (filename, cwd) => {
    cwd = cwd || process.cwd()
    filename = core.path.join(cwd, filename)
    if (process.env.debug) {
      console.log('Reading configuration %s.', filename)
    }
    return core.config(filename)
  }

  const coreconfig = load('defaults.json', __dirname)

  return filename => {
    const userconfig = filename && core.exists(filename) ? load(filename) : {}
    return core.merge({}, coreconfig, userconfig)
  }
}
