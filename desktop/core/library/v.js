'use strict'

const Operator = require('../operator')
// TODO
function OperatorV (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'v', passive)

  this.name = 'variable'
  this.info = 'Reads and write globally available variables.'

  this.ports.haste.write = { x: -1, y: 0 }
  this.ports.input.read = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.storage = { write: null, read: null }

  this.haste = function () {
    this.storage.write = this.listen(this.ports.haste.write)
    this.storage.read = this.listen(this.ports.input.read)

    if (this.storage.write !== '.' && this.storage.read !== '.') {
      this.ports.output = null
    }
  }

  this.run = function () {
    if (this.storage.write !== '.' || this.storage.read === '.') { return }

    for (const id in orca.runtime) {
      const operator = orca.runtime[id]
      if (orca.lockAt(operator.x, operator.y)) { continue }
      const glyph = operator.glyph.toLowerCase()
      if (glyph !== 'v') { continue }
      const write = operator.storage.write
      if (write !== this.storage.read) { continue }
      this.output(operator.storage.read)
      return
    }

    this.output('.')
  }
}

module.exports = OperatorV
