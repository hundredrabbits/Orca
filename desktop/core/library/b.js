'use strict'

const Operator = require('../operator')

function OperatorB (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'b', passive)

  this.name = 'banger'
  this.info = 'Bangs if input is `1`, `N`, `S`, `W`, `E` or `Z`.'

  this.ports.input.val = { x: 1, y: 0, unlock: true }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const val = this.listen(this.ports.input.val)
    const chr = ['1', 'W', 'S', 'N', 'E', 'Z', '*']
    const res = chr.indexOf(val.toUpperCase()) > -1 ? '*' : '.'
    this.output(`${res}`)
  }
}

module.exports = OperatorB
