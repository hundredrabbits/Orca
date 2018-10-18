'use strict'

const FnBase = require('./_base')

function FnP (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'p', passive)
}

module.exports = FnP
