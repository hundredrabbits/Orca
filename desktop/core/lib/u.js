'use strict'

const FnBase = require('./_base')

function FnU (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'u', isPassive)
}

module.exports = FnU
