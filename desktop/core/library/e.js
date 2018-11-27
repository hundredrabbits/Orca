'use strict'

const Operator = require('../operator')

function OperatorE (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'e', passive)

  this.name = 'east'
  this.info = 'Moves eastward, or bangs.'
  this.draw = false

  this.haste = function () {
    this.move(1, 0)
    this.passive = false
  }
}

module.exports = OperatorE
