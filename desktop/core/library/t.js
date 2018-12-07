'use strict'

const Operator = require('../operator')

function OperatorT (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 't', passive)

  this.name = 'track'
  this.info = 'Reads an eastward operator with offset.'

  this.ports.input.val = { x: 1, y: 0 }
  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.haste.key = { x: -2, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    this.len = clamp(this.listen(this.ports.haste.len, true), 1, 24)
    this.key = this.listen(this.ports.haste.key, true)
    for (let x = 1; x <= this.len; x++) {
      orca.lock(this.x + x, this.y)
    }
    this.ports.input.val = { x: (this.key % this.len) + 1, y: 0 }
  }

  this.run = function () {
    const res = this.listen(this.ports.input.val)
    this.output(`${res}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorT
