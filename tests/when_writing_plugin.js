const config = require('../lib/index.js')
const expect = require('chai').expect

describe('when writing plugin methods', () => {
  const definition = {
    js: {
      build: stream => stream,
      src: '*.js',
      tasks: ['jslint']
    },
    jslint: stream => stream
  }

  describe('should be able to override build', () => {
    const api = config(definition, {
      configfile: 'test/test.json',
      methods: {build: configuration => true }
    })

    it('should not throw not supported error', () => expect(api.build).to.not.throw(Error))
    it('should throw not supported on method not overridden', () => expect(api.clean).to.throw(Error))
    it('should return api after calling', () => expect(api.build()).to.be.eql(api))
  })
})
