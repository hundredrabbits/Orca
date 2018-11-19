'use strict'

const Fn = require('../fn')

function FnE (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'e', passive)

  this.name = 'east'
  this.info = 'Moves eastward, or bangs.'

  this.haste = function () {
    if (!pico.inBounds(this.x + 1, this.y) || pico.glyphAt(this.x + x, this.y + y) !== '.') { this.explode(); return }
    this.move(1, 0)
    this.passive = false
  }
}

module.exports = FnE
