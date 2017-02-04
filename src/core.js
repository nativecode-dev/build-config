const sprintf = require('sprintf-js').sprintf

const core = {
  args: args => Array.prototype.slice.call(args),
  array: value => core.is.array(value) ? value : core.defined(value) ? [value] : [],
  buffer: filename => new Buffer(core.stream(filename)),
  colorize: (color, ...args) => {
    return core.colors[color](sprintf(...args))
  },
  colormap: {
    debug: 'gray',
    error: 'red',
    info: 'white',
    warn: 'yellow'
  },
  colors: require('chalk'),
  config: filename => {
    const json = core.json(filename)
    return core.resolve(json)
  },
  defined: value => value !== null && value !== undefined && value !== '' && (value && value.length),
  debug: (...args) => {
    if (process.env.debug) {
      console.log(core.log('debug', ...args))
    }
  },
  dir: path => core.path.join(process.cwd(), path),
  error: (...args) => core.log('error', ...args),
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
  log: (type, ...args) => {
    const color = core.colormap[type] || 'white'
    return core.colorize(color, ...args)
  },
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
  resolve: (hash, options, all) => {
    const root = options || hash
    Object.keys(hash).map(key => {
      var value = hash[key]
      if (core.is.string(value) && (all || value.indexOf(':') === 0)) {
        const rendered = core.render(value, root)
        hash[key] = all ? rendered : rendered.substring(1)
      } else if (core.is.array(value) || core.is.object(value)) {
        core.resolve(value, root, all)
      }
    })
    return root
  },
  stream: filename => core.fs.readFileSync(filename),
  taskname: (prefix, name) => [prefix, name].join(':'),
  text: filename => core.stream(filename).toString(),
  unqiue: value => {
    let hash = {}
    let results = []
    Object.keys(value).map(key => {
      if (!hash[key]) {
        hash[key] = key
        results.push(value[key])
      }
    })
    return results
  },
  warn: (...args) => core.log('warn', ...args)
}

module.exports = core
