'use strict'

const FnBase = require('./_base')

function FnWireF (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'wire-f'
  this.glyph = '-'
  this.info = 'Send data along the wire, across an intersection.'
}

module.exports = FnWireF
