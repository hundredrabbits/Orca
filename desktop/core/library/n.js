'use strict'

import Operator from '../operator.js'

export default function OperatorN (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'n', passive)

  this.name = 'north'
  this.info = 'Moves Northward, or bangs'
  this.draw = false

  this.operation = function () {
    this.move(0, -1)
    this.passive = false
  }
}
