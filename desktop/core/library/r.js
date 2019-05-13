'use strict'

import Operator from '../operator.js'

export default function OperatorR (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'r', passive)

  this.name = 'random'
  this.info = 'Outputs random value'

  this.ports.haste.min = { x: -1, y: 0 }
  this.ports.input.max = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, sensitive: true }

  this.operation = function (force = false) {
    const min = this.listen(this.ports.haste.min, true)
    const max = this.listen(this.ports.input.max, true)
    const val = parseInt((Math.random() * ((max > 0 ? max : 36) - min)) + min)
    return orca.keyOf(val)
  }
}
