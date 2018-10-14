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

  this.inc = function (ch) {
    const index = pico.allowed.indexOf(ch)
    const result = pico.allowed[(index+1) % 10]
    return `${result}`
  }
}

module.exports = FnI
