'use strict'

const FnBase = require('./_base')

function FnT (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 't', passive)

  this.name = 'trigger'
  this.info = 'Bangs southward in the presence of `1`, `N`, `S`, `W`, `E` or `Z` northward.'
  this.ports = [{ x: -1, y: 0, bang: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    const n = this.west()

    if (!n) { return }

    if (n.glyph === '1' || n.glyph === 'w' || n.glyph === 's' || n.glyph === 'n' || n.glyph === 'e' || n.glyph === '*' || n.glyph === 'z') {
      this.fire()
    }
  }

  this.fire = function () {
    pico.add(this.x, this.y + 1, '*')
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnT
