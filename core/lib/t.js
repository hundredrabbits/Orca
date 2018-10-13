'use strict'

const FnBase = require('./_base')

function FnT (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'trigger'
  this.glyph = 't'
  this.info = 'Bangs southward in the presence of `1`, `U`, `R`, `D`, `L` or `Z` westward.'
  this.ports = [{ x: -1, y: 0 }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (this.west('1') || this.west('w') || this.west('s') || this.west('n') || this.west('e') || this.west('b')) {
      this.fire()
    }
  }

  this.fire = function () {
    pico.add(this.x, this.y + 1, 'b')
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnT
