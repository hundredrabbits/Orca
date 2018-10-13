'use strict'

const FnBase = require('./_base')

function FnL (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'left'
  this.glyph = 'l'
  this.info = 'Moves westward.'

  this.operation = function () {
    if (this.is_free(-1, 0) != true) { this.replace('b'); this.lock(); return }
    this.move(-1, 0)
  }
}

module.exports = FnL
