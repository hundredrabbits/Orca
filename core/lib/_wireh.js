'use strict'

const FnBase = require('./_base')

function FnWireH (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'wire-h'
  this.glyph = '-'
}

module.exports = FnWireH
