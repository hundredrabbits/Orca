'use strict'

const FnBase = require('./_base')

function FnVol (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.type = 'midi'
  this.name = 'volume'
  this.glyph = '?'
  this.info = 'Sets the volume for the Pico terminal.'

  this.ports = [{ x: 1, y: 0, output: true }, { x: 2, y: 0, output: true }, { x: 3, y: 0, output: true }]

  this.haste = function () {
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x + 2, this.y)
    pico.lock(this.x + 3, this.y)
  }

  this.run = function () {
    const val = `${pico.glyphAt(this.x + 1, this.y)}${pico.glyphAt(this.x + 2, this.y)}${pico.glyphAt(this.x + 3, this.y)}`
    if (val.indexOf('.') > -1) { return }
    pico.terminal.qqq.setVolume(val)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnVol
