'use strict'

const FnBase = require('./_base')

function FnI (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'increment'
  this.glyph = 'i'
  this.info = 'Increments southward numeric fn on bang.'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: 1, output: true }, { x: 1, y: 0, input: true }, { x: -1, y: 0, input: true }]

  this.operation = function () {
    if (!this.bang()) { return }

    const w = this.west()
    const e = this.east()
    const s = this.south()

    const min = w ? pico.allowed.indexOf(w.glyph) : 0
    const max = e ? pico.allowed.indexOf(e.glyph) : 9
    const val = s ? pico.allowed.indexOf(s.glyph) : 0

    const result = val + 1 >= max ? min : val + 1

    pico.add(this.x, this.y + 1, `${result}`)
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnI
