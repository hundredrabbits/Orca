'use strict'

const FnBase = require('./_base')

function FnV (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'v', passive)
}

module.exports = FnV
