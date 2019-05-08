'use strict'

const Operator = require('../operator')

function OperatorZ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'u', passive)

  this.name = 'Lerp'
  this.info = 'Transitions southward operator toward input.'

  this.ports.haste.rate = { x: -1, y: 0, default: '1' }
  this.ports.input.target = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const rate = this.listen(this.ports.haste.rate, true)
    const target = this.listen(this.ports.input.target, true)
    const val = this.listen(this.ports.output, true)
    const mod = val <= target - rate ? rate : val >= target + rate ? -rate : target - val
    return orca.keyOf(val + mod)
  }
}

module.exports = OperatorZ
