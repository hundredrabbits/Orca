'use strict'

const Operator = require('../operator')

function OperatorY (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'y', passive)

  this.name = 'jymper'
  this.info = 'Outputs the westward operator.'

  this.ports.haste.val = { x: -1, y: 0 }
  this.ports.output = { x: 1, y: 0 }

  this.haste = function () {
    orca.lock(this.x + 1, this.y)
  }

  this.run = function () {
    const val = this.listen(this.ports.haste.val)
    this.output(val)
  }
}

module.exports = OperatorY
