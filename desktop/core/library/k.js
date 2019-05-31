'use strict'

import Operator from '../operator.js'

export default function OperatorK (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'k', passive)

  this.name = 'konkat'
  this.info = 'Reads multiple variables'

  this.ports.len = { x: -1, y: 0, clamp: { min: 1 } }

  this.operation = function (force = false) {
    this.len = this.listen(this.ports.len, true)
    for (let x = 1; x <= this.len; x++) {
      orca.lock(this.x + x, this.y)
      const key = orca.glyphAt(this.x + x, this.y)
      if (key === '.') { continue }
      orca.lock(this.x + x, this.y + 1)
      orca.write(this.x + x, this.y + 1, orca.valueIn(key))
    }
  }
}
