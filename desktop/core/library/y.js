'use strict'

import Operator from '../operator.js'

export default function OperatorY (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'y', passive)

  this.name = 'jymper'
  this.info = 'Outputs westward operand'

  this.ports.val = { x: -1, y: 0 }
  this.ports.output = { x: 1, y: 0 }

  this.operation = function (force = false) {
    orca.lock(this.x + 1, this.y)
    return this.listen(this.ports.val)
  }
}
