'use strict'

const FnBase = require('./_base')

function FnF (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'f', passive)

  this.type = 'math'
  this.name = 'if'
  this.info = 'Bangs if east and west fns are equal, southward.'
  this.ports.push({ x: -1, y: 0 })
  this.ports.push({ x: 1, y: 0 })
  this.ports.push({ x: 0, y: 1, output: true })

  this.haste = function () {
    pico.lock(this.x, this.y + 1)
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x - 1, this.y)
  }

  this.operation = function () {
    const w = this.west()
    const e = this.east()
    const west = !w ? '.' : w.glyph
    const east = !e ? '.' : e.glyph

    if (west === east) {
      pico.add(this.x, this.y + 1, '1')
    } else {
      pico.add(this.x, this.y + 1, '0')
    }
  }
}

module.exports = FnF
