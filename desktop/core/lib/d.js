'use strict'

const FnBase = require('./_base')

function FnD (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'd', isPassive)
}

module.exports = FnD
