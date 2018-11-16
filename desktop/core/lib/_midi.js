'use strict'

const FnBase = require('./_base')

function FnMidi (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, ':', true)

  this.name = 'midi'
  this.info = 'Sends Midi'

  this.ports = [{ x: 1, y: 0, input: true }, { x: 2, y: 0, input: true }, { x: 3, y: 0, input: true }, { x: 0, y: 0, bang: true }]

  this.haste = function () {
    pico.lock(this.x + 1, this.y)
    pico.lock(this.x + 2, this.y)
    pico.lock(this.x + 3, this.y)
  }

  this.run = function () {
    if (!this.bang()) { return }

    const notes = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'b']

    const channelGlyph = pico.glyphAt(this.x + 1, this.y)
    const octaveGlyph = pico.glyphAt(this.x + 2, this.y)
    const noteGlyph = pico.glyphAt(this.x + 3, this.y)

    if (channelGlyph === '.' || octaveGlyph === '.' || noteGlyph === '.') { return }
    if (notes.indexOf(noteGlyph) < 0) { return }

    const channelValue = pico.valueOf(channelGlyph)
    const octaveValue = pico.valueOf(octaveGlyph)
    const noteValue = pico.valueOf(noteGlyph)

    const channel = clamp(channelValue, 0, 15)
    const octave = clamp(octaveValue, 2, 9)
    const note = notes.indexOf(noteGlyph)

    terminal.midi.send(channel, octave, note, 127)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnMidi
