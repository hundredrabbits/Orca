'use strict'

const Operator = require('../operator')

function OperatorK (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'k', passive)

  this.name = 'kill'
  this.info = 'Kills southward operator.'
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    this.output('.')
  }
}

module.exports = OperatorK
