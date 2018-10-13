'use strict'

const FnBase = require('./_base')

function FnR (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'right'
  this.glyph = 'r'
  this.info = 'Moves eastward.'

  this.operation = function () {
    if (this.is_free(1, 0) != true) { this.replace('b'); this.lock(); return }
    this.move(1, 0)
  }
}

module.exports = FnR
