'use strict'

const FnMove = require('./_move')

function FnS (pico, x, y, passive) {
  FnMove.call(this, pico, x, y, passive)

  this.type = 'direction'
  this.name = 'south'
  this.glyph = passive ? 'S' : 's'
  this.info = 'Moves southward, or bangs.'

  this.haste = function () {
    if (this.signal()) { return }
    if (this.is_free(0, 1) !== true) { this.replace('*'); return }
    this.move(0, 1)
  }
}

module.exports = FnS
