'use strict'

import Operator from '../operator.js'

export default function OperatorBang (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '*', true)

  this.name = 'bang'
  this.info = 'Bangs neighboring operands'
  this.draw = false

  this.operation = function () {
    this.erase()
  }
}
