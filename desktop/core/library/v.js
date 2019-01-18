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
    this.output(query(this.storage.read))
  }

  function query (name) {
    if (name === '.') { return '.' }
    for (const id in orca.runtime) {
      const operator = orca.runtime[id]
      if (orca.lockAt(operator.x, operator.y)) { continue }
      if (operator.glyph !== 'v' && operator.glyph !== 'V') { continue }
      if (operator.storage.write !== name) { continue }
      return operator.storage.read
    }
    return '.'
  }
}

module.exports = OperatorV
