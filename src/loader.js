module.exports = core => {
  const loadconf = (filename, cwd) => {
    cwd = cwd || process.cwd()
    filename = core.path.join(cwd, filename)
    console.log(filename)
    if (process.env.debug) {
      console.log('Reading configuration %s.', filename)
    }
    return core.config(filename)
  }

  const coreconfig = loadconf('defaults.json', __dirname)

  return filename => {
    const userconfig = filename && core.exists(filename) ? loadconf(filename) : {}
    return core.merge({}, coreconfig, userconfig)
  }
}
