'use strict'

import Operator from '../operator.js'

export default function OperatorJ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'j', passive)

  this.name = 'jumper'
  this.info = 'Outputs northward operand'

  this.ports.haste.val = { x: 0, y: -1 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    orca.lock(this.x, this.y + 1)
  }

  this.operation = function (force = false) {
    return this.listen(this.ports.haste.val)
  }
}
