'use strict'

import Operator from '../operator.js'

export default function OperatorNull (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '.', false)

  this.name = 'null'
  this.info = 'empty'

  // Overwrite run, to disable draw.

  this.run = function (force = false) {

  }
}
