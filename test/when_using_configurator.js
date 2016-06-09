const core = require('../dist/core.js')
const configurator = require('../dist/configurator.js')(core)
const expect = require('chai').expect

describe('when using the configurator', () => {
  describe('and defining a build definition', () => {
    const definition = {
      html: stream => stream
        .pipe(() => true),
      js: {
        build: stream => stream
          .pipe(() => true),
        src: 'javascript',
        tasks: ['jslint']
      },
      jslint: stream => stream
        .pipe(() => true)
    }

    it('should create html configuration', () => {
      const configuration = configurator(definition)
      expect(configuration.builds.html.source).eql(configuration.common.sources.html)
    })

    it('should create html watcher', () => {
      const configuration = configurator(definition)
      expect(configuration.watches.html.source).eql(configuration.common.sources.html)
    })

    it('should create js configuration', () => {
      const configuration = configurator(definition)
      expect(configuration.builds.js.source).eql(configuration.common.sources.js)
    })

    it('should create js watcher', () => {
      const configuration = configurator(definition)
      expect(configuration.watches.js.source).eql(configuration.common.sources.js)
      expect(configuration.watches.js.dependencies).eql(['build:js'])
    })

    it('should create jslint configuration', () => {
      const configuration = configurator(definition)
      expect(configuration.builds.jslint.source).eql(configuration.common.sources.js)
    })

    it('should create jslint watcher', () => {
      const configuration = configurator(definition)
      expect(configuration.watches.jslint.source).eql(configuration.common.sources.js)
    })

    it('should resolve named dependencies', () => {
      const configuration = configurator(definition)
      expect(configuration.builds.js.dependencies).eql(['build:jslint'])
    })

    it('should ensure dependencies is empty', () => {
      const configuration = configurator(definition)
      expect(configuration.builds.jslint.dependencies).eql([])
    })
  })
})
