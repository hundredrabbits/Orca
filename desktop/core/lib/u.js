'use strict'

const FnBase = require('./_base')

function FnU (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'u', passive)
}

module.exports = FnU
