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
    },
    standard: {
      breakOnError: true,
      quiet: true
    }
  },
  sources: {
    js: ['src/**/*.js'],
    json: ['src/**/*.json'],
    package: 'package.json',
    tests: ['tests/**/*.js']
  }
}
