'use strict'

const Fn = require('../fn')

function FnY (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'y', passive)
}

module.exports = FnY
