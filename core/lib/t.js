'use strict'

const FnBase = require('./_base')

function FnT (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'trigger'
  this.glyph = 't'
  this.info = 'Bangs southward in the presence of `1`, `N`, `S`, `W`, `E` or `Z` westward.'
  this.ports = [{ x: -1, y: 0 }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    const w = this.west()

    if (!w) { return }

    if (w.glyph == '1' || w.glyph == 'w' || w.glyph == 's' || w.glyph == 'n' || w.glyph == 'e' || w.glyph == 'b' || w.glyph == 'z') {
      this.fire()
    }
  }

  this.fire = function () {
    pico.add(this.x, this.y + 1, 'b')
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnT
