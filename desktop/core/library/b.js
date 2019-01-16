'use strict'

const Operator = require('../operator')

function OperatorB (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'b', passive)

  this.name = 'bool'
  this.info = 'Bangs if input is not empty, or 0.'

  this.ports.input.val = { x: 1, y: 0, unlock: true }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const val = this.listen(this.ports.input.val)
    const res = val !== '.' && val !== '0' ? '*' : '.'
    this.output(`${res}`)
  }
}

module.exports = OperatorB
