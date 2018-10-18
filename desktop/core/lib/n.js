'use strict'

const FnMove = require('./_move')

function FnN (pico, x, y, passive) {
  FnMove.call(this, pico, x, y, passive)

  this.type = 'direction'
  this.name = 'north'
  this.glyph = passive ? 'N' : 'n'
  this.info = 'Moves Northward, or bangs.'

  this.haste = function () {
    if (this.signal()) { return }
    if (this.is_free(0, -1) !== true) { this.replace('*'); this.lock(); return }
    this.move(0, -1)
  }
}

module.exports = FnN
