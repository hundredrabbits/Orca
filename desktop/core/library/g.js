'use strict'

const Operator = require('../operator')

function OperatorG (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'g', passive)

  this.name = 'generator'
  this.info = 'Outputs the input southward.'

  this.ports.input.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, unlock: true }

  this.run = function () {
    const res = this.listen(this.ports.input.val)
    this.output(`${res}`)
  }
}

module.exports = OperatorG
