module.exports = (core) => {
  return configuration => {
    const sources = configuration.common.sources

    const setsource = value => {
      if (core.is.array(value)) {
        for (var index = 0; index < value.length; index++) {
          value[index] = setsource(value[index])
        }
      } else if (core.is.string(value) && sources[value]) {
        return sources[value]
      }
      return value
    }

    core.mapdeep(configuration,
      (key, value) => (key === 'sources' || key === 'src') ? setsource(value) : value)

    return configuration
  }
}
