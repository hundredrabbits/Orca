'use strict'

const Fn = require('../fn')

function FnZ (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'z', passive)
}

module.exports = FnZ
