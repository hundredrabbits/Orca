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
    const val1 = this.toValue(w ? w.glyph : null)
    const val2 = this.toValue(e ? e.glyph : null)

    pico.add(this.x, this.y + 1, val1 === val2 ? '1' : '0')
  }
}

module.exports = FnF
