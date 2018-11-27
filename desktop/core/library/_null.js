'use strict'

const Operator = require('../operator')

function OperatorNull (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '.', passive)

  this.name = 'null'
  this.info = 'empty'
}

module.exports = OperatorNull
