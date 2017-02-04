module.exports = {
  debug: {
    js: {
      title: 'js'
    }
  },
  destination: {
    lib: 'lib'
  },
  plugins: {
    babel: {
      presets: "es2015"
    }
  },
  sources: {
    js: ['src/**/*.js']
  }
}