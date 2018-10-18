'use strict'

const FnBase = require('./_base')

function FnO (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'o', passive)
}

module.exports = FnO
