'use strict'

const FnMove = require('./_move')

function FnW (pico, x, y) {
  FnMove.call(this, pico, x, y)

  this.name = 'west'
  this.glyph = 'w'
  this.info = 'Moves westward, or bangs.'

  this.operation = function () {
    if (this.signal()) { return }
    if (this.is_free(-1, 0) != true) { this.replace('b'); this.lock(); return }
    this.move(-1, 0)
  }
}

module.exports = FnW
