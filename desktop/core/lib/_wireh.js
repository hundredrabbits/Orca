'use strict'

const FnBase = require('./_base')

function FnWireH (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'wire-h'
  this.glyph = '-'
  this.info = 'Send data along the wire, horizontally.'
}

module.exports = FnWireH
