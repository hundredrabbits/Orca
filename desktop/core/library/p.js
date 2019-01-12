'use strict'

const Operator = require('../operator')

function OperatorP (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'p', passive)

  this.name = 'push'
  this.info = 'Writes an eastward operator with offset.'

  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.haste.key = { x: -2, y: 0 }
  this.ports.input.val = { x: 1, y: 0 }

  this.haste = function () {
    this.len = this.listen(this.ports.haste.len, true)
    if (this.len < 1) { return }
    this.ports.output = { x: (this.key % this.len), y: 1, unlock: true }
    this.key = this.listen(this.ports.haste.key, true)
    for (let x = 0; x < this.len; x++) {
      orca.lock(this.x + x, this.y + 1)
    }
  }

  this.run = function () {
    const res = this.listen(this.ports.input.val)
    this.output(`${res}`)
  }
}

module.exports = OperatorP
