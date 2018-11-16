'use strict'

const FnBase = require('./_base')

function FnA (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'a', passive)

  this.name = 'add'
  this.info = 'Creates the result of the addition of east and west fns, southward.'

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
    const res = this.toChar(val1 + val2)

    pico.add(this.x, this.y + 1, res)
  }
}

module.exports = FnA
