'use strict'

const Operator = require('../operator')

function OperatorV (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'v', passive)

  this.name = 'variable'
  this.info = 'Reads and write globally available variables.'

  this.ports.haste.write = { x: -1, y: 0 }
  this.ports.input.read = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    const write = this.listen(this.ports.haste.write)
    const read = this.listen(this.ports.input.read)

    if (write !== '.' && read !== '.') {
      this.ports.output = null
    }
  }

  this.run = function () {
    const write = this.listen(this.ports.haste.write)
    const read = this.listen(this.ports.input.read)

    if (write !== '.' || read === '.') {
      orca.values[write] = read
    } else if (write === '.') {
      this.output(orca.values[read])
    }
  }
}

module.exports = OperatorV
