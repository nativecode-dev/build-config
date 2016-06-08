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
        src: 'javascript'
      }
    }

    it('should create html configuration', () => {
      const configuration = configurator(definition)
      expect(configuration.builds.html.source).eql(configuration.common.sources.html)
    })

    it('should create html watcher', () => {
      const configuration = configurator(definition)
      expect(configuration.watches.html.source).eql(configuration.common.sources.html)
    })

    it('should create javascript configuration', () => {
      const configuration = configurator(definition)
      expect(configuration.builds.js.source).eql(configuration.common.sources.js)
    })

    it('should create javascript watcher', () => {
      const configuration = configurator(definition)
      expect(configuration.watches.js.source).eql(configuration.common.sources.js)
    })
  })
})
