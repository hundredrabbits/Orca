'use strict'

import Operator from '../operator.js'

export default function OperatorC (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'c', passive)

  this.name = 'clock'
  this.info = 'Outputs modulo of frame'

  this.ports.haste.rate = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.input.mod = { x: 1, y: 0, default: '8' }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const rate = this.listen(this.ports.haste.rate, true)
    const mod = this.listen(this.ports.input.mod, true)
    const val = (Math.floor(orca.f / rate) % mod)
    return orca.keyOf(val)
  }
}
