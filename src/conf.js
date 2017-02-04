/**
 * Helper to read configuration files and merge into a single
 * configuration object.
 * @param {object} - Provides shared functionality.
 */
module.exports = core => {
  const load = (filename, cwd) => {
    cwd = cwd || process.cwd()
    filename = core.path.join(cwd, filename)
    if (process.env.debug) {
      core.debug("Reading '%s' in '%s'.", core.path.basename(filename), core.path.dirname(filename))
    }
    return core.config(filename)
  }

  const secrets = filename => {
    filename = filename || '.secrets.json'
    const home = core.os.homedir()
    const local = process.cwd()
    const parent = core.path.resolve(process.cwd(), '../')

    if (core.exists(filename, home)) {
      core.debug("Reading '%s' in '%s'.", filename, home)
      return core.json(core.path.join(home, filename))
    } else if (core.exists(filename, local)) {
      core.debug("Reading '%s' in '%s'.", filename, local)
      return core.json(core.path.join(local, filename))
    } else if (core.exists(filename, parent)) {
      core.debug("Reading '%s' in '%s'.", filename, parent)
      return core.json(core.path.join(parent, filename))
    }
    core.debug("Failed to find '%s' anywhere.", filename)
    return {}
  }

  // Loads the default configuration so we have sane defaults.
  const coreconfig = load('defaults.json', __dirname)

  // Fix sources to ensure that they are always arrays.
  Object.keys(coreconfig.common.sources).map(key => {
    const value = coreconfig.common.sources[key]
    coreconfig.common.sources[key] = core.array(value)
  })

  // Apply secrets to the default configuration.
  coreconfig.options.secrets = secrets()

  return (filenames, attach) => {
    filenames = core.array(filenames)
    var voltron = core.merge(true, {}, coreconfig)
    Object.keys(filenames).map(index => {
      const filename = filenames[index]
      const userconfig = filename && core.exists(filename) ? load(filename) : {}
      if (attach) {
        const key = core.path.parse(filename).name
        voltron[key] = userconfig
      } else {
        voltron = core.merge(true, voltron, userconfig)
      }
    })
    return voltron
  }
}