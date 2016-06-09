const core = {
  array: value => value instanceof Array ? value : [value],
  buffer: filename => new Buffer(core.stream(filename)),
  config: filename => core.json(filename),
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
  stream: filename => core.fs.readFileSync(filename),
  taskname: (prefix, name) => [prefix, name].join(':'),
  text: filename => core.stream(filename).toString()
}

module.exports = core
