'use strict'

const FnBase = require('./_base')

function FnX (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'x', isPassive)
}

module.exports = FnX
