'use strict'

const FnMove = require('./_move')

function FnN (pico, x, y) {
  FnMove.call(this, pico, x, y)

  this.name = 'north'
  this.glyph = 'n'
  this.info = 'Moves Northward, or bangs.'

  this.haste = function () {
    if (this.signal()) { return }
    if (this.is_free(0, -1) !== true) { this.replace('b'); this.lock(); return }
    this.move(0, -1)
  }
}

module.exports = FnN
