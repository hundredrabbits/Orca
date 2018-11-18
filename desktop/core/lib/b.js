'use strict'

const FnBase = require('./_base')

function FnB (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'b', isPassive)
}

module.exports = FnB
