'use strict'

import Operator from '../operator.js'

export default function OperatorZ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'z', passive)

  this.name = 'lerp'
  this.info = 'Transitions operand to input'

  this.ports.haste.rate = { x: -1, y: 0, default: '1' }
  this.ports.input.target = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true, reader: true }

  this.operation = function (force = false) {
    const rate = this.listen(this.ports.haste.rate, true)
    const target = this.listen(this.ports.input.target, true)
    const val = this.listen(this.ports.output, true)
    const mod = val <= target - rate ? rate : val >= target + rate ? -rate : target - val
    return orca.keyOf(val + mod)
  }
}
