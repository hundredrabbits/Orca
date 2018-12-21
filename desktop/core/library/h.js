'use strict'

const Operator = require('../operator')

function OperatorH (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'h', passive)

  this.name = 'halt'
  this.info = 'Stops southward operators from operating.'

  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    orca.lock(this.x + this.ports.output.x, this.y + this.ports.output.y)
  }
}

module.exports = OperatorH
