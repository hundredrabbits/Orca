'use strict'

const Operator = require('../operator')
// TODO
function OperatorV (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'v', passive)

  this.name = 'variable'
  this.info = 'Reads and write globally available variables.'

  this.ports.haste.write = { x: -1, y: 0 }
  this.ports.input.value = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    const key = this.listen(this.ports.haste.write, true)

    if (key > 9) {
      this.ports.output = null
    }
  }

  this.run = function () {
    if (this.listen(this.ports.haste.write, true) > 9) { return }

    const key = this.listen(this.ports.input.value)
    const res = this.read(key)

    if (res !== '.') {
      this.output(`${res}`)
    }
  }

  this.read = function (key) {
    for (const id in orca.runtime) {
      const operator = orca.runtime[id]
      if (orca.lockAt(operator.x, operator.y)) { continue }
      const glyph = operator.glyph.toLowerCase()
      if (glyph !== 'v') { continue }
      const write = operator.listen(operator.ports.haste.write)
      if (write !== key) { continue }
      const value = operator.listen(operator.ports.input.value)
      return value
    }

    return null
  }
}

module.exports = OperatorV
