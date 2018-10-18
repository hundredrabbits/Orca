'use strict'

const FnBase = require('./_base')

function FnB (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.type = 'unique'
  this.name = 'bang'
  this.glyph = 'b'
  this.info = 'The bang is used to trigger various fns, only lasts one cycle.'

  this.haste = function () {
    this.remove()
  }
}

module.exports = FnB
