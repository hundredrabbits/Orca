'use strict'

const Operator = require('../operator')

function OperatorH (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'h', passive)

  this.name = 'halt'
  this.info = 'Stops southward operators from operating.'

  this.ports.haste.len = { x: -1, y: 0 }

  this.haste = function () {
    this.len = clamp(this.listen(this.ports.haste.len, true), 0, 16)
    for (let x = 0; x < this.len; x++) {
      orca.lock(this.x + x, this.y + 1)
    }
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorH
