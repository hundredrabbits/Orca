'use strict'

const Operator = require('../operator')

function OperatorR (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'r', passive)

  this.name = 'random'
  this.info = 'Outputs a random value.'

  this.ports.haste.min = { x: -1, y: 0 }
  this.ports.input.max = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const min = this.listen(this.ports.haste.min, true)
    const max = this.listen(this.ports.input.max, true)
    if (min === max) { return }
    const val = parseInt((Math.random() * ((max || 36) - min)) + min)
    const res = orca.keyOf(val)
    this.output(`${res}`, false, true)
  }
}

module.exports = OperatorR
