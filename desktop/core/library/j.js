'use strict'

const Operator = require('../operator')

function OperatorJ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'j', passive)

  this.name = 'jump'
  this.info = 'Outputs the northward operator.'

  this.ports.input.val = { x: 0, y: -1 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    orca.lock(this.x, this.y + 1)
  }

  this.run = function () {
    const val = this.listen(this.ports.input.val)
    this.output(val)
  }
}

module.exports = OperatorJ
