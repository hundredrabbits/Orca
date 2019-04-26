'use strict'

const Operator = require('../operator')

function OperatorF (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'f', passive)

  this.name = 'if'
  this.info = 'Bangs if both inputs are equal.'

  this.ports.haste.a = { x: -1, y: 0 }
  this.ports.input.b = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const a = this.listen(this.ports.haste.a)
    const b = this.listen(this.ports.input.b)
    const res = a === b && a !== '.' && b !== '.' ? '*' : '.'
    this.output(`${res}`)
  }
}

module.exports = OperatorF
