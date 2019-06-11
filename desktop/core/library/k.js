'use strict'

import Operator from '../operator.js'

export default function OperatorK (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'k', passive)

  this.name = 'konkat'
  this.info = 'Reads multiple variables'

  this.ports.len = { x: -1, y: 0, clamp: { min: 1 } }

  this.operation = function (force = false) {
    this.len = this.listen(this.ports.len, true)
    for (let offset = 0; offset < this.len; offset++) {
      const key = orca.glyphAt(this.x + offset + 1, this.y)
      orca.lock(this.x + offset + 1, this.y)
      if (key === '.') { continue }
      const inPort = { x: offset + 1, y: 0 }
      const outPort = { x: offset + 1, y: 1, output: true }
      this.addPort(`in${offset}`, inPort)
      this.addPort(`out${offset}`, outPort)
      const res = orca.valueIn(key)
      this.output(`${res}`, outPort)
    }
  }
}
