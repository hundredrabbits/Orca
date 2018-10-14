'use strict'

const FnBase = require('./_base')

function FnWireN (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'wire-n'
  this.glyph = '*'
  this.info = 'Send data along the wire, entry or exit.'
}

module.exports = FnWireN
