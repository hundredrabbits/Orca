'use strict'

import Operator from '../operator.js'

export default function OperatorP (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'p', passive)

  this.name = 'push'
  this.info = 'Writes eastward operand'

  this.ports.len = { x: -1, y: 0, unlocked: true, clamp: { min: 1 } }
  this.ports.key = { x: -2, y: 0, unlocked: true }
  this.ports.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.len, true)
    for (let x = 0; x < len; x++) {
      orca.lock(this.x + x, this.y + 1)
    }
    const key = this.listen(this.ports.key, true)
    this.ports.output = { x: (key % len), y: 1 }
    return this.listen(this.ports.val)
  }
}
