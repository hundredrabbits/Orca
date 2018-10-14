'use strict'

const FnBase = require('./_base')

function FnD (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'deflect'
  this.glyph = 'd'
  this.info = 'Converts neighboors into direction fns.'
  this.ports = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }]

  this.operation = function () {
    if (this.north() && this.north().glyph !== 'n') {
      pico.add(this.x, this.y - 1, 'n')
      pico.lock(this.x, this.y - 1)
    }
    if (this.south() && this.south().glyph !== 'd') {
      pico.add(this.x, this.y + 1, 'd')
      pico.lock(this.x, this.y + 1)
    }
    if (this.west() && this.west().glyph !== 'w') {
      pico.add(this.x - 1, this.y, 'w')
      pico.lock(this.x - 1, this.y)
    }
    if (this.east() && this.east().glyph !== 'e') {
      pico.add(this.x + 1, this.y, 'e')
      pico.lock(this.x + 1, this.y)
    }
  }
}

module.exports = FnD
