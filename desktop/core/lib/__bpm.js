'use strict'

const FnBase = require('./_base')

function FnBpm (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'bpm'
  this.glyph = '?'
  this.info = 'Changes the speed of Pico.'

  this.ports = [{ x: 1, y: 0, output: true }, { x: 2, y: 0, output: true }, { x: 3, y: 0, output: true }]

  this.haste = function () {
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x + 2, this.y)
    pico.lock(this.x + 3, this.y)
  }

  this.run = function () {
    const val = `${pico.glyphAt(this.x + 1, this.y)}${pico.glyphAt(this.x + 2, this.y)}${pico.glyphAt(this.x + 3, this.y)}`
    if (val.indexOf('.') > -1) { return }
    pico.terminal.setSpeed(val)
  }
  
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnBpm
