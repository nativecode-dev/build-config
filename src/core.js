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
  fs: require('fs'),
  json: filename => JSON.parse(core.buffer(filename)),
  merge: require('merge'),
  path: require('path'),
  resolve: (hash, root) => {
    root = root || hash
    Object.keys(hash).map(key => {
      var value = hash[key]
      if (value && value.length && value.indexOf(':') === 0) {
        hash[key] = render(value, root).substring(1)
      } else if (value instanceof Object) {
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
