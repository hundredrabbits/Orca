'use strict'

import Operator from '../operator.js'

export default function OperatorF (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'f', passive)

  this.name = 'if'
  this.info = 'Bangs if inputs are equal'

  this.ports.haste.a = { x: -1, y: 0 }
  this.ports.input.b = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, bang: true }

  this.operation = function (force = false) {
    const a = this.listen(this.ports.haste.a)
    const b = this.listen(this.ports.input.b)
    return a === b && a !== '.' && b !== '.'
  }
}
