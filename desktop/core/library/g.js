'use strict'

import Operator from '../operator.js'

export default function OperatorG (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'g', passive)

  this.name = 'generator'
  this.info = 'Writes operands with offset'

  this.ports.x = { x: -3, y: 0 }
  this.ports.y = { x: -2, y: 0 }
  this.ports.len = { x: -1, y: 0, clamp: { min: 1 } }

  this.operation = function (force = false) {
    const len = this.listen(this.ports.len, true)
    const x = this.listen(this.ports.x, true)
    const y = this.listen(this.ports.y, true) + 1
    for (let offset = 0; offset < len; offset++) {
      const inPort = { x: offset + 1, y: 0 }
      const outPort = { x: x + offset, y: y, output: true }
      this.addPort(`in${offset}`, inPort)
      this.addPort(`out${offset}`, outPort)
      const res = this.listen(inPort)
      this.output(`${res}`, outPort)
    }
  }
}
