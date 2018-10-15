'use strict'

const FnBase = require('./_base')

function FnWireH (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'wire-v'
  this.glyph = '|'
  this.info = 'Send data along the wire, vertically.'
}

module.exports = FnWireH
