'use strict'

import Operator from '../operator.js'

export default function OperatorP (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'p', passive)

  this.name = 'push'
  this.info = 'Writes eastward operand'

  this.ports.len = { x: -1, y: 0, clamp: { min: 1 } }
  this.ports.key = { x: -2, y: 0 }
  this.ports.val = { x: 1, y: 0 }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.len, true)
    const key = this.listen(this.ports.key, true)
    for (let x = 0; x < len; x++) {
      orca.lock(this.x + x, this.y + 1)
    }
    this.ports.output = { x: (key % len), y: 1 }
    return this.listen(this.ports.val)
  }
}
