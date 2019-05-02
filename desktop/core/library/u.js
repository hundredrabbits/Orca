'use strict'

const Operator = require('../operator')

function OperatorU (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'u', passive)

  this.name = 'jumpuper'
  this.info = 'Outputs the southward operator.'

  this.ports.haste.val = { x: 0, y: 1 }
  this.ports.output = { x: 0, y: -1 }

  this.haste = function () {
    orca.lock(this.x, this.y - 1)
  }

  this.operation = function (force = false) {
    return this.listen(this.ports.haste.val)
  }
}

module.exports = OperatorU

