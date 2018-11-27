'use strict'

const Operator = require('../operator')

function OperatorN (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'n', passive)

  this.name = 'north'
  this.info = 'Moves Northward, or bangs.'
  this.draw = false

  this.haste = function () {
    this.move(0, -1)
    this.passive = false
  }
}

module.exports = OperatorN
