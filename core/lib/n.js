'use strict'

const FnBase = require('./_base')

function FnN (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'north'
  this.glyph = 'n'
  this.info = 'Moves Northward, or bangs.'

  this.operation = function () {
    if (this.is_free(0, -1) != true) { this.replace('b'); this.lock(); return }
    this.move(0, -1)
  }
}

module.exports = FnN
