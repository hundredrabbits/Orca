'use strict'

const Operator = require('../operator')

function OperatorU (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'u', passive)

  this.name = 'Util'
  this.info = 'Outputs the index of a value.'

  this.ports.haste.key = { x: -2, y: 0 }
  this.ports.haste.len = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    const len = this.listen(this.ports.haste.len, true)
    for (let x = 1; x <= len; x++) {
      orca.lock(this.x + x, this.y)
    }
  }

  this.operation = function (force = false) {
    const key = this.listen(this.ports.haste.key)
    const len = this.listen(this.ports.haste.len, true)
    const index = orca.indexAt(this.x + 1, this.y)
    const seg = orca.s.substr(index, len)
    const res = seg.indexOf(key)
    if (res >= 0) {
      this.ports.input.target = { x: res + 1, y: 0 }
    }
    return res < 0 ? '.' : orca.keyOf(res)
  }
}

module.exports = OperatorU
