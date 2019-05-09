'use strict'

import Operator from '../operator.js'

export default function OperatorY (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'y', passive)

  this.name = 'jymper'
  this.info = 'Outputs the westward operator.'

  this.ports.haste.val = { x: -1, y: 0 }
  this.ports.output = { x: 1, y: 0 }

  this.haste = function () {
    orca.lock(this.x + 1, this.y)
  }

  this.operation = function (force = false) {
    return this.listen(this.ports.haste.val)
  }
}
