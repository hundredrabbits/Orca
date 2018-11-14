'use strict'

const FnBase = require('./_base')

function FnQ (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'q', true)
}

module.exports = FnQ
