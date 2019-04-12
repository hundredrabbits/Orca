'use strict'

const Operator = require('../operator')

function OperatorO (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'o', passive)

  this.name = 'offset'
  this.info = 'Reads a distant operator with offset.'

  this.ports.haste.x = { x: -2, y: 0 }
  this.ports.haste.y = { x: -1, y: 0 }
  this.ports.input.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    const x = this.listen(this.ports.haste.x, true)
    const y = this.listen(this.ports.haste.y, true)
    this.ports.input.val = { x: x + 1, y: y }
  }

  this.run = function () {
    const x = this.listen(this.ports.haste.x, true)
    const y = this.listen(this.ports.haste.y, true)
    this.ports.input.val = { x: x + 1, y: y }
    orca.lock(this.x + x + 1, this.y + y)
    const res = this.listen(this.ports.input.val)
    this.output(`${res}`, true)
  }
}

module.exports = OperatorO
