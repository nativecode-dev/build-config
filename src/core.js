const core = {
  array: value => core.is.array(value) ? value : core.defined(value) ? [value] : [],
  buffer: filename => new Buffer(core.stream(filename)),
  config: filename => {
    const json = core.json(filename)
    return core.resolve(json)
  },
  defined: value => value !== null && value !== undefined && value !== '' && (value && value.length),
  debug: function () {
    if (process.env.debug) {
      console.log.apply(console, [].slice.call(arguments))
    }
  },
  dir: path => core.path.join(process.cwd(), path),
  exists: (path, cwd) => {
    cwd = cwd || process.cwd()
    if (!path) return false
    try {
      return core.fs.statSync(core.path.join(cwd, path))
    } catch (err) {
      return false
    }
  },
  filters: {
    arrays: (key, hash) => core.is.array(hash[key]),
    functions: (key, hash) => core.is.func(hash[key]),
    objects: (key, hash) => core.is.object(hash[key]),
    strings: (key, hash) => core.is.string(hash[key])
  },
  fs: require('fs'),
  is: {
    array: value => value && value instanceof Array,
    func: value => value && typeof value === 'function',
    object: value => value && typeof value === 'object',
    string: value => value && typeof value === 'string'
  },
  json: filename => JSON.parse(core.buffer(filename)),
  mapdeep: (hash, action) => {
    Object.keys(hash).map(key => {
      const value = action(key, hash[key])
      if (core.is.array(value) || core.is.object(value)) {
        core.mapdeep(value, action)
      }
    })
  },
  merge: require('merge').recursive,
  os: require('os'),
  path: require('path'),
  render: require('mustache').render,
  require: value => {
    if (!value) throw new Error('Required value was not provided.')
  },
  quote: (value, quote, separator) => {
    quote = quote || "'"
    separator = separator || ', '
    if (core.is.array(value)) {
      return value.map(item => core.quote(item)).join(separator)
    }
    if (core.is.string(value)) {
      return quote + value + quote
    }
    return value
  },
  resolve: (hash, root) => {
    root = root || hash
    Object.keys(hash).map(key => {
      var value = hash[key]
      if (value && value.length && value.indexOf(':') === 0) {
        hash[key] = core.render(value, root).substring(1)
      } else if (value && typeof value === 'object') {
        core.resolve(value, root)
      }
    })
    return root
  },
  stream: filename => core.fs.readFileSync(filename),
  taskname: (prefix, name) => [prefix, name].join(':'),
  text: filename => core.stream(filename).toString(),
  unqiue: value => {
    const hash = {}
    const results = []
    Object.keys(value).map(key => {
      if (!hash[key]) {
        hash[key] = key
        results.push(value[key])
      }
    })
    return results
  }
}

module.exports = core
