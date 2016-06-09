const config = require('../dist/index.js')
const expect = require('chai').expect

describe('when using as a module', () => {
  it('should expose a main function', () => expect(config).is.instanceof(Function))

  describe('and using the api', () => {
    const api = config({}, {})
    it('build should throw not supported', () => expect(api.build).to.throw(Error))
    it('clean should throw not supported', () => expect(api.clean).to.throw(Error))
    it('deploy should throw not supported', () => expect(api.deploy).to.throw(Error))
    it('package should throw not supported', () => expect(api.package).to.throw(Error))
    it('publish should throw not supported', () => expect(api.publish).to.throw(Error))
    it('watch should throw not supported', () => expect(api.watch).to.throw(Error))
  })
})
