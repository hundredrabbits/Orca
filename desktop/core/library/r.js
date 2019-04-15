'use strict'

const Operator = require('../operator')

function OperatorR (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'r', passive)

  this.name = 'random'
  this.info = 'Outputs a random value.'

  this.ports.input.min = { x: 1, y: 0 }
  this.ports.input.max = { x: 2, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const min = this.listen(this.ports.input.min, true)
    const max = this.listen(this.ports.input.max, true)
    const val = parseInt((Math.random() * ((max || 10) - min)) + min)
    const res = orca.keyOf(val)
    this.output(`${res}`)
  }
}

module.exports = OperatorR
