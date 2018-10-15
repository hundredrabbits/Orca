'use strict'

const FnBase = require('./_base')

function FnK (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'kill'
  this.glyph = 'k'
  this.info = '[TODO]Kills southward fns, on bang.'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }]

  this.operation = function () {
    if (this.bang()) {
      pico.remove(this.x - 1, this.y)
      pico.remove(this.x + 1, this.y)
      pico.remove(this.x, this.y + 1)
      pico.remove(this.x, this.y - 1)

      pico.lock(this.x, this.y + 1)
      pico.lock(this.x, this.y - 1)
      pico.lock(this.x + 1, this.y)
      pico.lock(this.x - 1, this.y)
    }
  }
}

module.exports = FnK
