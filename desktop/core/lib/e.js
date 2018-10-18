'use strict'

const FnMove = require('./_move')

function FnE (pico, x, y, passive) {
  FnMove.call(this, pico, x, y, passive)

  this.type = 'direction'
  this.name = 'east'
  this.glyph = passive ? 'E' : 'e'
  this.info = 'Moves eastward, or bangs.'

  this.haste = function () {
    if (this.signal()) { return }
    if (this.is_free(1, 0) !== true) { this.replace('*'); this.lock(); return }
    this.move(1, 0)
  }
}

module.exports = FnE
