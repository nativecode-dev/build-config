module.exports = {
  array: value => value instanceof Array ? value : [value],
  merge: require('merge'),
  taskname: (prefix, name) => [prefix, name].join(':')
}
