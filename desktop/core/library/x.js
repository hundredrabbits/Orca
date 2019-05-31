'use strict'

import Operator from '../operator.js'

export default function OperatorX (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'x', passive)

  this.name = 'write'
  this.info = 'Writes operand with offset'

  this.ports.x = { x: -2, y: 0 }
  this.ports.y = { x: -1, y: 0 }
  this.ports.val = { x: 1, y: 0 }

  this.operation = function (force = false) {
    const x = this.listen(this.ports.x, true)
    const y = this.listen(this.ports.y, true) + 1
    this.ports.output = { x: x, y: y }
    return this.listen(this.ports.val)
  }
}
