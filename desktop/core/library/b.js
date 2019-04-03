'use strict'

const Operator = require('../operator')

function OperatorB (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'b', passive)

  this.name = 'bool'
  this.info = 'Bangs if input is not empty, or 0.'

  this.ports.haste.val = { x: -1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const val = this.listen(this.ports.haste.val)
    const res = val !== '.' && val !== '0' ? '*' : '.'
    this.output(`${res}`)
  }
}

module.exports = OperatorB
