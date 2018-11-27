'use strict'

const Operator = require('../operator')

function OperatorZ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'z', passive)

  this.name = 'diagonal'
  this.info = 'Moves diagonally toward south-east.'
  this.draw = false

  this.haste = function () {
    this.move(1, 1)
    this.passive = false
  }
}

module.exports = OperatorZ
