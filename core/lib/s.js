'use strict'

const FnBase = require('./_base')

function FnS (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'south'
  this.glyph = 's'
  this.info = 'Moves southward, or bangs.'

  this.operation = function () {
    if (this.is_free(0, 1) != true) { this.replace('b'); this.lock(); return }
    this.move(0, 1)
  }
}

module.exports = FnS
