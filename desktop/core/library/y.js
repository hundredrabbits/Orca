'use strict'

const Operator = require('../operator')

function OperatorY (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'y', passive)
}

module.exports = OperatorY
