const render = require('mustache').render

const core = {
  array: value => value instanceof Array ? value : [value],
  buffer: filename => new Buffer(core.stream(filename)),
  config: filename => {
    const json = core.json(filename)
    return core.resolve(json)
  },
  dir: path => core.path.join(process.cwd(), path),
  exists: path => {
    if (!path) return false
    try {
      return core.fs.statFileSync(path)
    } catch (err) {
      return false
    }
  },
  filters: {
    arrays: (key, hash) => core.is.array(hash[key]),
    functions: (key, hash) => core.is.func(hash[key]),
    objects: (key, hash) => core.is.object(hash[key]),
    strings: (key, hash) => core.is.string(hash[key]),
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
  merge: require('merge'),
  path: require('path'),
  resolve: (hash, root) => {
    root = root || hash
    Object.keys(hash).map(key => {
      var value = hash[key]
      if (value && value.length && value.indexOf(':') === 0) {
        hash[key] = render(value, root).substring(1)
      } else if (value && typeof value === 'object') {
        core.resolve(value, root)
      }
    })
    return root
  },
  stream: filename => core.fs.readFileSync(filename),
  taskname: (prefix, name) => [prefix, name].join(':'),
  text: filename => core.stream(filename).toString()
}

module.exports = core
