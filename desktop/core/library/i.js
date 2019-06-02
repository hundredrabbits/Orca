'use strict'

import Operator from '../operator.js'

export default function OperatorI (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'i', passive)

  this.name = 'increment'
  this.info = 'Increments southward operand'

  this.ports.step = { x: -1, y: 0, default: '1' }
  this.ports.mod = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true, reader: true }

  this.operation = function (force = false) {
    const step = this.listen(this.ports.step, true)
    const mod = this.listen(this.ports.mod, true)
    const val = this.listen(this.ports.output, true)
    return orca.keyOf((val + step) % (mod > 0 ? mod : 36))
  }
}
