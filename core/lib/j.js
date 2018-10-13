'use strict'

const FnBase = require('./_base')

function FnJ (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'jump'
  this.glyph = 'j'
  this.info = 'Moves the westward _fn_ to eastward, or the eastward _fn_ westward, on **bang**.'

  this.ports = [{ x: -1, y: 0 }, { x: 1, y: 0, output: true }, { x: 0, y: 0, bang: true }]

  this.operation = function () {
    if (!this.bang()) { return }

    if (this.west()) {
      pico.add(this.x + 1, this.y, this.west().glyph)
      pico.remove(this.x - 1, this.y)
      pico.lock(this.x - 1, this.y)
      pico.lock(this.x + 1, this.y)
    } else if (this.east()) {
      pico.add(this.x - 1, this.y, this.east().glyph)
      pico.remove(this.x + 1, this.y)
      pico.lock(this.x - 1, this.y)
      pico.lock(this.x + 1, this.y)
    }
  }
}

module.exports = FnJ
