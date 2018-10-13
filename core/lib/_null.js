'use strict'

const FnBase = require('./_base')

function FnNull (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'null'
  this.glyph = '.'
}

module.exports = FnNull
