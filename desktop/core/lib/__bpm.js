'use strict'

const FnBase = require('./_base')

function FnBpm (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.type = 'midi'
  this.name = 'bpm'
  this.glyph = '?'
  this.info = 'Sets the speed for the Pico terminal.'

  this.ports = [{ x: 1, y: 0, output: true }, { x: 2, y: 0, output: true }, { x: 3, y: 0, output: true }]

  this.haste = function () {
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x + 2, this.y)
    pico.lock(this.x + 3, this.y)
  }

  this.run = function () {
    const val = `${pico.glyphAt(this.x + 1, this.y)}${pico.glyphAt(this.x + 2, this.y)}${pico.glyphAt(this.x + 3, this.y)}`

    if (parseInt(val) === pico.terminal.bpm) { return }

    if (val.indexOf('.') > -1) {
      const bpm = pad(pico.terminal.bpm)
      pico.add(this.x + 1, this.y, bpm.substr(0, 1))
      pico.add(this.x + 2, this.y, bpm.substr(1, 1))
      pico.add(this.x + 3, this.y, bpm.substr(2, 1))
      return
    }
    pico.terminal.setSpeed(val)
  }

  function pad (n) { return ('000' + n).slice(-3) }
  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnBpm
