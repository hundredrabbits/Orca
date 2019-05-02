'use strict'

const Operator = require('../operator')

function OperatorJ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'j', passive)

  this.name = 'jumper'
  this.info = 'Copies the northward value southward.'

  this.ports.haste.y = { x: -1, y: 0 }
  this.ports.input.val = { x: 0, y: -1 }

  this.operation = function (force = false) {
    const y = this.listen(this.ports.haste.y, true) + 1

    this.ports.output = { x: 0, y: y }
    return this.listen(this.ports.input.val)
  }
}

module.exports = OperatorJ
