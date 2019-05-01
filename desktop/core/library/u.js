'use strict'

const Operator = require('../operator')

function OperatorU (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'u', passive)

  this.name = 'Unhalt'
  this.info = 'Releases input on bang.'

  this.ports.input.target = { x: 0, y: 1 }

  this.haste = function () {
    orca.lock(this.x + this.ports.input.target.x, this.y + this.ports.input.target.y)
  }

  this.operation = function (force = false) {
    if (this.hasNeighbor('*') || force === true) {
      orca.unlock(this.x + this.ports.input.target.x, this.y + this.ports.input.target.y)
    }
  }
}

module.exports = OperatorU
