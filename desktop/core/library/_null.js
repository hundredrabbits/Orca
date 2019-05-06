'use strict'

const Operator = require('../operator')

function OperatorNull (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '.', false)

  this.name = 'null'
  this.info = 'empty'

  // Overwrite run, to disable draw.

  this.run = function (force = false) {

  }
}

module.exports = OperatorNull
