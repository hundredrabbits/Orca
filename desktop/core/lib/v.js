'use strict'

const FnBase = require('./_base')

function FnV (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.name = 'value'
  this.glyph = 'v'
  this.info = 'Creates a numerical value between 0 and 5 based on the number of present _fns_ westward.'
  this.ports = [{ x: -1, y: 0 }, { x: -2, y: 0 }, { x: -3, y: 0 }, { x: -4, y: 0 }, { x: -5, y: 0 }]

  this.operation = function () {
    const val = (pico.glyphAt(this.x - 1, this.y) !== '.' ? 1 : 0) + (pico.glyphAt(this.x - 2, this.y) !== '.' ? 1 : 0) + (pico.glyphAt(this.x - 3, this.y) !== '.' ? 1 : 0) + (pico.glyphAt(this.x - 4, this.y) !== '.' ? 1 : 0) + (pico.glyphAt(this.x - 5, this.y) !== '.' ? 1 : 0)

    pico.add(this.x + 1, this.y, val + '')
    pico.lock(this.x + 1, this.y)
  }
}

module.exports = FnV
