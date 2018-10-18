'use strict'

const FnBase = require('./_base')

function FnW (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.type = 'direction'
  this.name = 'west'
  this.glyph = passive ? 'W' : 'w'
  this.info = 'Moves westward, or bangs.'

  this.haste = function () {
    if (this.is_free(-1, 0) !== true) { this.replace('*'); this.lock(); return }
    this.move(-1, 0)
  }
}

module.exports = FnW
