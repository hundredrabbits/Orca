'use strict'

const Fn = require('../fn')

function FnD (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'd', passive)
}

module.exports = FnD
