'use strict'

const FnMove = require('./_move')

function FnW (pico, x, y, passive) {
  FnMove.call(this, pico, x, y, passive)

  this.type = 'direction'
  this.name = 'west'
  this.glyph = passive ? 'W' : 'w'
  this.info = 'Moves westward, or bangs.'

  this.haste = function () {
    if (this.signal()) { return }
    if (this.is_free(-1, 0) !== true) { this.replace('*'); this.lock(); return }
    this.move(-1, 0)
  }
}

module.exports = FnW
