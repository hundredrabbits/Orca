'use strict'

const FnBase = require('./_base')

function FnMidi (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, ':', true)

  this.name = 'midi'
  this.info = 'Sends Midi'

  this.ports = [{ x: 1, y: 0, input: true }, { x: 2, y: 0, input: true }, { x: 3, y: 0, input: true }, { x: 0, y: 0, bang: true }]

  this.haste = function () {
    pico.lock(this.x, this.y - 1)
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x + 2, this.y)
    pico.lock(this.x + 3, this.y)
  }

  this.run = function () {
    if (!this.bang()) { return }

    const channelGlyph = pico.glyphAt(this.x + 1, this.y)
    const octaveGlyph = pico.glyphAt(this.x + 2, this.y)
    const noteGlyph = pico.glyphAt(this.x + 3, this.y)

    if (channelGlyph === '.' || octaveGlyph === '.' || noteGlyph === '.') { return }

    const channelValue = pico.allowed.indexOf(channelGlyph)
    const octaveValue = pico.allowed.indexOf(octaveGlyph)
    const noteValue = pico.allowed.indexOf(noteGlyph)

    const channel = clamp(channelValue, 0, 15)
    const octave = clamp(octaveValue, 3, 8)
    const note = this.convert(noteValue)

    terminal.qqq.send(channel, octave, note, 127)
  }

  this.convert = function (ch) {
    return 64
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnMidi
