const core = require('../lib/core.js')
const configure = require('../lib/configure.js')(core, {})
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
        .pipe(() => true),
      markdown: {
        build: stream => stream,
        src: '**/*.md'
      }
    }

    it('should create html configuration', () => {
      const configuration = configure(definition)
      expect(configuration.builds.html.source).eql(configuration.common.sources.html)
    })

    it('should create html watcher', () => {
      const configuration = configure(definition)
      expect(configuration.watches.html.source).eql(configuration.common.sources.html)
    })

    it('should create js configuration', () => {
      const configuration = configure(definition)
      expect(configuration.builds.js.source).eql(configuration.common.sources.js)
    })

    it('should create js watcher', () => {
      const configuration = configure(definition)
      expect(configuration.watches.js.source).eql(configuration.common.sources.js)
      expect(configuration.watches.js.dependencies).eql(['build:js'])
    })

    it('should create jslint configuration', () => {
      const configuration = configure(definition)
      expect(configuration.builds.jslint.source).eql(configuration.common.sources.js)
    })

    it('should create jslint watcher', () => {
      const configuration = configure(definition)
      expect(configuration.watches.jslint.source).eql(configuration.common.sources.js)
    })

    it('should resolve named dependencies', () => {
      const configuration = configure(definition)
      expect(configuration.builds.js.dependencies).eql(['build:jslint'])
    })

    it('should ensure dependencies is empty', () => {
      const configuration = configure(definition)
      expect(configuration.builds.jslint.dependencies).eql([])
    })

    it('should have empty secrets', () => {
      const configuration = configure(definition)
      expect(configuration.options.secrets).is.not.undefined
    })
  })
})
