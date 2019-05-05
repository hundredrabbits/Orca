'use strict'

const Operator = require('../operator')

function OperatorM (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'm', passive)

  this.name = 'modulo'
  this.info = 'Outputs the modulo of input.'

  this.ports.haste.val = { x: -1, y: 0 }
  this.ports.input.mod = { x: 1, y: 0, clamp: { min: 1 }, default: 'G' }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const val = this.listen(this.ports.haste.val, true)
    const mod = this.listen(this.ports.input.mod, true)
    return orca.keyOf(val % mod)
  }
}

module.exports = OperatorM
