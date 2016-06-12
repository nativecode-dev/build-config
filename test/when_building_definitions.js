const adapter = {}
const core = require('../dist/core.js')
const configure = require('../dist/configure.js')(core, adapter)
const expect = require('chai').expect

describe('when converting', () => {
  describe('build definitions', () => {
    describe('using standard form', () => {
      const standard = {
        any: {
          build: stream => stream,
          dest: 'dist',
          src: ['**/*'],
          tasks: ['dependency']
        }
      }

      const config = configure(standard)
      describe('for any', () => {
        it('build should be a function', () => expect(config.builds.any.build).is.instanceof(Function))
        it('should depend on dependency', () => expect(config.builds.any.dependencies).eql(['dependency']))
        it('should be named build:any', () => expect(config.builds.any.name).is.equal('build:any'))
        it('should target dist', () => expect(config.builds.any.target).is.equal('dist'))
        it('should use recursive glob', () => expect(config.builds.any.source).contains('**/*'))
      })
    })

    describe('using short-hand form', () => {
      const shorthand = {
        javascript: stream => stream
      }

      const config = configure(shorthand)
      describe('for javascript', () => {
        it('build should be a function', () => expect(config.builds.javascript.build).is.instanceof(Function))
        it('should have no dependencies', () => expect(config.builds.javascript.dependencies).is.empty)
        it('should be named build:javascript', () => expect(config.builds.javascript.name).is.equal('build:javascript'))
        it('should target dist', () => expect(config.builds.javascript.target).is.equal('dist'))
        it('should use javascript source', () => expect(config.builds.javascript.source).is.eql(config.common.sources.js))
      })
    })
  })
})
