'use strict'

const FnBase = require('./_base')

function FnE (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'east'
  this.glyph = 'r'
  this.info = 'Moves eastward, or bangs.'

  this.operation = function () {
    if (this.is_free(1, 0) != true) { this.replace('b'); this.lock(); return }
    this.move(1, 0)
  }
}

module.exports = FnE
