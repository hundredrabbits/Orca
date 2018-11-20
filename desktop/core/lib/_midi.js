'use strict'

const Fn = require('../fn')

function FnMidi (pico, x, y, passive) {
  Fn.call(this, pico, x, y, ':', true)

  this.name = 'midi'
  this.info = 'Sends Midi a midi note.'

  this.ports.input.channel = { x: 1, y: 0 }
  this.ports.input.octave = { x: 2, y: 0 }
  this.ports.input.note = { x: 3, y: 0 }
  this.ports.input.velocity = { x: 4, y: 0 }

  this.run = function () {
    if (!this.bang()) { return }

    this.draw = false

    const notes = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'b']
    const channel = clamp(this.listen(this.ports.input.channel, true), 0, 15)
    const octave = clamp(this.listen(this.ports.input.octave, true), 2, 9)
    const note = this.listen(this.ports.input.note)
    const velocity = this.ratio(this.listen(this.ports.input.velocity, true), 127)

    if (notes.indexOf(note) < 0) { return }

    terminal.midi.send(channel, octave, notes.indexOf(note), velocity)
  }

  this.ratio = function (val, max) {
    const r = !val ? 1 : val < 10 ? (val / 9) : (val - 10) / 25
    return parseInt(r * max)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnMidi
