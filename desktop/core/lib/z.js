'use strict'

const FnBase = require('./_base')
// TODO
function FnZ (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'z', isPassive)
}

module.exports = FnZ
