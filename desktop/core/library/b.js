'use strict'

import Operator from '../operator.js'

export default function OperatorB (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'b', passive)

  this.name = 'bounce'
  this.info = 'Outputs values between inputs'

  this.ports.rate = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.mod = { x: 1, y: 0, default: '8' }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const rate = this.listen(this.ports.rate, true)
    const mod = this.listen(this.ports.mod, true) - 1
    const key = Math.floor(orca.f / rate) % (mod * 2)
    return orca.keyOf(key <= mod ? key : mod - (key - mod))
  }
}
