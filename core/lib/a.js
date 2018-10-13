'use strict'

const FnBase = require('./_base')

function FnA (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'add'
  this.glyph = 'a'
  this.info = 'Creates the result of the addition of east and west fns, southward.'
  this.ports = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.west() || !this.east()) {
      pico.remove(this.x, this.y + 1)
      return
    }

    const left = !this.west() ? '0' : this.west().glyph
    const right = !this.east() ? '0' : this.east().glyph

    const index = (this.convert(left) + this.convert(right)) % pico.allowed.length
    const output = pico.allowed[index]

    pico.add(this.x, this.y + 1, output)
  }

  this.convert = function (glyph) {
    return pico.allowed.indexOf(glyph)
  }
}

module.exports = FnA
