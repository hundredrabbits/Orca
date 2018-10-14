'use strict'

const FnBase = require('./_base')

function FnI (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'increment'
  this.glyph = 'i'
  this.info = 'Increments southward numeric fn on bang.'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.bang()) { return }
    if (!this.south()) { return }

    const n = this.south()
    pico.add(this.x, this.y + 1, this.inc(n.glyph))
  }

  this.inc = function (letter) {
    if (parseInt(letter) === 9) { return '0' } else if (parseInt(letter) === 0) { return '1' } else if (parseInt(letter) > 0) { return parseInt(letter) + 1 + '' }

    const index = pico.allowed.indexOf(letter)

    if (index < 0) { return }

    return pico.allowed[(index + 1) % pico.allowed.length]
  }
}

module.exports = FnI
