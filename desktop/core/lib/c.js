'use strict'

const FnBase = require('./_base')

function FnC (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'c', passive)

  this.name = 'clock'
  this.info = 'Adds a constant value southward.'
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

    const min = w ? pico.allowed.indexOf(w.glyph) : 0
    const max = e ? pico.allowed.indexOf(e.glyph) : 9
    const result = (pico.f % max) + min

    pico.add(this.x, this.y + 1, `${pico.allowed[result]}`)
  }
}

module.exports = FnC
