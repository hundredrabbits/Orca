'use strict'

const Operator = require('../operator')

function OperatorO (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'o', passive)

  this.name = 'read'
  this.info = 'Reads a distant operator with offset.'

  this.ports.haste.x = { x: -2, y: 0 }
  this.ports.haste.y = { x: -1, y: 0 }
  this.ports.haste.read = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function (force = false) {
    const x = this.listen(this.ports.haste.x, true)
    const y = this.listen(this.ports.haste.y, true)
    this.ports.haste.read = { x: x + 1, y: y }
    return this.listen(this.ports.haste.read)
  }
}

module.exports = OperatorO
