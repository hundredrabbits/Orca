'use strict'

const FnBase = require('./_base')

function FnT (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'trigger'
  this.glyph = 't'
  this.info = 'Bangs southward in the presence of `1`, `U`, `R`, `D`, `L` or `Z` westward.'
  this.ports = [{ x: -1, y: 0 }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (this.left('1') || this.left('r') || this.left('l') || this.left('u') || this.left('d') || this.left('b') || this.left('z')) {
      this.fire()
    }
  }

  this.fire = function () {
    pico.add(this.x, this.y + 1, 'b')
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnT
