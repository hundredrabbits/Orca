'use strict'

const Fn = require('../fn')

function FnU (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'u', passive)
}

module.exports = FnU
