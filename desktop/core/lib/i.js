'use strict'

const FnBase = require('./_base')

function FnI (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'i', passive)

  this.name = 'increment'
  this.info = 'Increments southward numeric fn on bang.'
  this.ports.push({ x: 0, y: 1, output: true })
  this.ports.push({ x: 1, y: 0, input: true })
  this.ports.push({ x: -1, y: 0, input: true })

  this.haste = function () {
    pico.lock(this.x, this.y + 1)
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x - 1, this.y)
  }

  this.operation = function () {
    const w = this.west()
    const e = this.east()
    const s = this.south()

    const min = w ? pico.valueOf(w.glyph) : 0
    const max = e ? pico.valueOf(e.glyph) : 9
    const val = s ? pico.valueOf(s.glyph) : 0

    const result = val + 1 >= max ? min : val + 1

    pico.add(this.x, this.y + 1, `${pico.allowed[result]}`)
  }
}

module.exports = FnI
