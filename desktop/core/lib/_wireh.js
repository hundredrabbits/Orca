'use strict'

const FnBase = require('./_base')

function FnWireH (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.type = 'wire'
  this.name = 'wire-h'
  this.glyph = '-'
  this.info = 'Send data along the wire, horizontally.'
}

module.exports = FnWireH
