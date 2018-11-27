'use strict'

const Operator = require('../operator')

function OperatorBang (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '*', true)

  this.name = 'bang'
  this.info = 'Bangs neighboring operators.'
  this.draw = false

  this.haste = function () {
    this.passive = true
    this.erase()
  }
}

module.exports = OperatorBang
