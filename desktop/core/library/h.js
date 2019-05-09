'use strict'

import Operator from '../operator.js'

export default function OperatorH (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'h', passive)

  this.name = 'halt'
  this.info = 'Stops southward operators from operating.'

  this.ports.output = { x: 0, y: 1, reader: true }

  this.haste = function () {
    orca.lock(this.x + this.ports.output.x, this.y + this.ports.output.y)
  }

  this.operation = function (force = false) {
    return this.listen(this.ports.output, true)
  }
}
