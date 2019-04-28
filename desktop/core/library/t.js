'use strict'

const Operator = require('../operator')

function OperatorT (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 't', passive)

  this.name = 'track'
  this.info = 'Reads an eastward operator with offset.'

  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.haste.key = { x: -2, y: 0 }
  this.ports.haste.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    const len = this.listen(this.ports.haste.len, true, 1)
    for (let x = 1; x <= len; x++) {
      orca.lock(this.x + x, this.y)
    }
  }

  this.run = function () {
    const len = this.listen(this.ports.haste.len, true, 1)
    const key = this.listen(this.ports.haste.key, true)
    this.ports.haste.val = { x: (key % len) + 1, y: 0 }
    const res = this.listen(this.ports.haste.val)
    this.output(`${res}`)
  }
}

module.exports = OperatorT
