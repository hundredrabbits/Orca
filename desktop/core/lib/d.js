'use strict'

const FnBase = require('./_base')

function FnD (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'd', passive)
}

module.exports = FnD
