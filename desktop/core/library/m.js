'use strict'

import Operator from '../operator.js'

export default function OperatorM (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'm', passive)

  this.name = 'multiply'
  this.info = 'Outputs product of inputs'

  this.ports.haste.a = { x: -1, y: 0 }
  this.ports.input.b = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const a = this.listen(this.ports.haste.a, true)
    const b = this.listen(this.ports.input.b, true)
    return orca.keyOf(a * b)
  }
}
