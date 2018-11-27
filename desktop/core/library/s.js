'use strict'

const Operator = require('../operator')

function OperatorS (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 's', passive)

  this.name = 'south'
  this.info = 'Moves southward, or bangs.'
  this.draw = false

  this.haste = function () {
    this.move(0, 1)
    this.passive = false
  }
}

module.exports = OperatorS
