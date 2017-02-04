const core = require('../lib/core.js')
const expect = require('chai').expect

describe('when using core functions', () => {
  describe('array', () => {
    it('should return empty array on null', () => expect(core.array(null)).to.be.an.instanceof(Array))
    it('should return empty array on undefined', () => expect(core.array(null)).to.be.an.instanceof(Array))
    it('should return string as array', () => expect(core.array('test').length).equal(1))
  })

  describe('taskname', () => {
    it('should allow name concatentation', () => {
      expect(core.taskname('build', 'js')).equal('build:js')
    })
  })
})
