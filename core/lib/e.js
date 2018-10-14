'use strict'

const FnMove = require('./_move')

function FnE (pico, x, y) {
  FnMove.call(this, pico, x, y)

  this.name = 'east'
  this.glyph = 'e'
  this.info = 'Moves eastward, or bangs.'

  this.operation = function () {
    if (this.signal()) { return }
    if (this.is_free(1, 0) != true) { this.replace('b'); this.lock(); return }
    this.move(1, 0)
  }
}

module.exports = FnE
