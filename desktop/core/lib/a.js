'use strict'

const FnBase = require('./_base')

function FnA (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.type = 'math'
  this.name = 'add'
  this.glyph = 'a'
  this.info = 'Creates the result of the addition of east and west fns, southward.'
  this.ports = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1, output: true }]

  this.haste = function () {
    pico.lock(this.x, this.y + 1)
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x - 1, this.y)
  }

  this.operation = function () {
    const w = this.west()
    const e = this.east()
    const west = !w ? '0' : w.glyph
    const east = !e ? '0' : e.glyph
    const index = (this.convert(west) + this.convert(east)) % pico.allowed.length
    const output = pico.allowed[index]
    pico.add(this.x, this.y + 1, output)
  }

  this.convert = function (glyph) {
    return pico.allowed.indexOf(glyph)
  }
}

module.exports = FnA
