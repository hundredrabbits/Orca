'use strict'

const FnBase = require('./_base')

function FnM (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'modulo'
  this.glyph = 'm'
  this.info = 'Creates the result of the modulo operation of east and west _fns_, southward.'
  this.ports = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.left() || !this.right()) { return }

    const val = pico.glyphs.indexOf(this.left().glyph)
    const mod = pico.glyphs.indexOf(this.right().glyph)

    if (mod == 0) { return }

    pico.add(this.x, this.y + 1, `${parseInt(val) % parseInt(mod)}`)
  }
}

module.exports = FnM
