'use strict'

const FnBase = require('./_base')
// TODO
function FnV (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'v', isPassive)
}

module.exports = FnV
