'use strict'

const FnBase = require('./_base')

function FnP (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'p', isPassive)
}

module.exports = FnP
