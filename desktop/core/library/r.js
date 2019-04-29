'use strict'

const Operator = require('../operator')

function OperatorR (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'r', passive)

  this.name = 'random'
  this.info = 'Outputs a random value.'

  this.ports.haste.min = { x: -1, y: 0 }
  this.ports.input.max = { x: 1, y: 0, default: 36 }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const min = this.listen(this.ports.haste.min, true)
    const max = this.listen(this.ports.input.max, true)
    if (min === max) { return }
    const val = parseInt((Math.random() * (max - min)) + min)
    return orca.keyOf(val)
  }
}

module.exports = OperatorR
