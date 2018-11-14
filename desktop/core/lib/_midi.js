'use strict'

const FnBase = require('./_base')

function FnMidi (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, ':', true)

  this.name = 'midi'
  this.info = 'Sends Midi'

  this.ports = [{ x: 0, y: -1, input: true }, { x: 1, y: 0, output: true }, { x: 2, y: 0, output: true }]

  this.haste = function () {
    pico.lock(this.x, this.y - 1)
    pico.lock(this.x + 1, this.y)
  }

  this.run = function () {
    const n = this.north()
    if (!n || !this.bang()) { return }
    const e = this.east()

    const channel = 3
    const octave = !e ? 3 : this.convert(e.glyph)
    const note = this.convert(n.glyph)
    const velocity = 127
    terminal.qqq.send(channel, octave, note, velocity)
  }

  this.convert = function (glyph) {
    return pico.allowed.indexOf(glyph)
  }
}

module.exports = FnMidi
