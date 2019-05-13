'use strict'

import Operator from '../operator.js'

export default function OperatorE (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'e', passive)

  this.name = 'east'
  this.info = 'Moves eastward, or bangs'
  this.draw = false

  this.haste = function () {
    this.move(1, 0)
    this.passive = false
  }
}
