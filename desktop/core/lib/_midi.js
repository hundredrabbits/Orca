'use strict'

const FnBase = require('./_base')

function FnMidi (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, ':', true)

  this.name = 'midi'
  this.info = 'Sends Midi'

  this.ports.input.channel = { x: 1, y: 0 }
  this.ports.input.octave = { x: 2, y: 0 }
  this.ports.input.note = { x: 3, y: 0 }

  this.run = function () {
    if (!this.bang()) { return }

    const notes = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'b']
    const channel = clamp(this.listen(this.ports.input.channel, true),0,15)
    const octave = clamp(this.listen(this.ports.input.octave, true),2,9)
    const note = this.listen(this.ports.input.note)

    if (notes.indexOf(note) < 0) { return }

    terminal.midi.send(channel, octave, notes.indexOf(note), 127)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnMidi
