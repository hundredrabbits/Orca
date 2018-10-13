'use strict'

const FnBase = require('./_base')

function FnB (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'bang'
  this.glyph = 'b'
  this.info = 'The **bang** is used to trigger various _fns_, only lasts one cycle.'

  this.operation = function () {
    this.remove()
  }
}

module.exports = FnB
