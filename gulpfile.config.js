module.exports = {
  debug: {
    js: {
      title: 'js'
    },
    json: {
      title: 'json'
    }
  },
  destination: {
    lib: 'lib'
  },
  plugins: {
    babel: {
      presets: 'es2015'
    },
    mocha: {
      reporter: 'spec'
    }
  },
  sources: {
    js: ['src/**/*.js'],
    json: ['src/**/*.json'],
    tests: ['tests/**/*.js']
  }
}