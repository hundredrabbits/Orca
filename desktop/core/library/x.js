'use strict'

const Operator = require('../operator')

function OperatorX (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'x', passive)

  this.name = 'teleport'
  this.info = 'Writes a distant operator with offset.'

  this.ports.haste.x = { x: -2, y: 0 }
  this.ports.haste.y = { x: -1, y: 0 }
  this.ports.input.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, unlock: true }

  this.run = function () {
    const x = this.listen(this.ports.haste.x, true)
    const y = this.listen(this.ports.haste.y, true) + 1
    this.ports.output = { x: x, y: y, unlock: true }

    const res = this.listen(this.ports.input.val)
    this.output(`${res}`, true)
  }
}

module.exports = OperatorX
