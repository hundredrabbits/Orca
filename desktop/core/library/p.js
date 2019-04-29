'use strict'

const Operator = require('../operator')

function OperatorP (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'p', passive)

  this.name = 'push'
  this.info = 'Writes an eastward operator with offset.'

  this.ports.haste.len = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.haste.key = { x: -2, y: 0 }
  this.ports.input.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    const len = this.listen(this.ports.haste.len, true)
    for (let x = 0; x < len; x++) {
      orca.lock(this.x + x, this.y + 1)
    }
  }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.haste.len, true)
    const key = this.listen(this.ports.haste.key, true)
    this.ports.output = { x: (key % len), y: 1 }
    return this.listen(this.ports.input.val)
  }
}

module.exports = OperatorP
