'use strict'

const Operator = require('../operator')

function OperatorG (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'g', passive)
}

module.exports = OperatorG
