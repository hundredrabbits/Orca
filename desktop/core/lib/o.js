'use strict'

const FnBase = require('./_base')

function FnO (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'o', isPassive)
}

module.exports = FnO
