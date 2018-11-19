'use strict'

const Fn = require('../fn')

function FnS (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 's', passive)

  this.name = 'south'
  this.info = 'Moves southward, or bangs.'

  this.haste = function () {
    if (!pico.inBounds(this.x, this.y + 1) || pico.glyphAt(this.x + x, this.y + y) !== '.') { this.explode(); return }
    this.move(0, 1)
    this.passive = false
  }
}

module.exports = FnS
