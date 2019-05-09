'use strict'

import Operator from '../operator.js'

export default function OperatorW (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'w', passive)

  this.name = 'west'
  this.info = 'Moves westward, or bangs.'
  this.draw = false

  this.haste = function () {
    this.move(-1, 0)
    this.passive = false
  }
}
