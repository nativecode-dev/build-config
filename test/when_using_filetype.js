const expect = require('chai').expect
const Configurator = require('../dist/v2/Build/Configurator.js')
const FileType = require('../dist/v2/Build/FileType.js').FileType

describe('when using FileType', () => {
  const type = new FileType(['htm', 'html'])
  it('should create with multiple extensions', () => {
    expect(type.extensions).to.be.eql(['htm', 'html'])
  })
  it('should create dotted extensions', () => {
    expect(type.extensionsWithDot).to.be.eql(['.htm', '.html'])
  })
})
