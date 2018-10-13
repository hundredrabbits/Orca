'use strict'

const FnBase = require('./_base')

function FnI (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'increment'
  this.glyph = 'i'
  this.info = 'Increments southward numeric _fn_ on **bang**.'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.bang()) { return }
    if (!this.down()) { return }

    const n = this.down()
    pico.add(this.x, this.y + 1, this.inc(n.glyph))
  }

  this.inc = function (letter) {
    if (parseInt(letter) == 9) { return '0' }
    if (parseInt(letter) == 0) { return '1' }
    if (parseInt(letter) > 0) { return parseInt(letter) + 1 + '' }

    const index = pico.glyphs.indexOf(letter)

    if (index < 0) { return }

    return pico.glyphs[(index + 1) % pico.glyphs.length]
  }
}

module.exports = FnI
