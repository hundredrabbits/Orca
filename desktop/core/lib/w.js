'use strict'

const Fn = require('../fn')

function FnW (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'w', passive)

  this.name = 'west'
  this.info = 'Moves westward, or bangs.'

  this.haste = function () {
    if (!pico.inBounds(this.x - 1, this.y) || pico.glyphAt(this.x + x, this.y + y) !== '.') { this.explode(); return }
    this.move(-1, 0)
    this.passive = false
  }
}

module.exports = FnW
