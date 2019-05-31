'use strict'

import Operator from '../operator.js'

export default function OperatorQ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'q', passive)

  this.name = 'query'
  this.info = 'Reads operands with offset'

  this.ports.x = { x: -3, y: 0 }
  this.ports.y = { x: -2, y: 0 }
  this.ports.len = { x: -1, y: 0, clamp: { min: 1 } }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.len, true)
    const x = this.listen(this.ports.x, true)
    const y = this.listen(this.ports.y, true)
    for (let i = 1; i <= len; i++) {
      orca.lock(this.x + x + i, this.y + y)
      this.ports[`val${i}`] = { x: x + i, y: y }
      this.ports.output = { x: i - len, y: 1 }
      const res = this.listen(this.ports[`val${i}`])
      this.output(`${res}`)
    }
    this.ports.output = { x: 0, y: 1 }
  }
}
