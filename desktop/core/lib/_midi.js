'use strict'

const Fn = require('../fn')

function FnMidi (orca, x, y, passive) {
  Fn.call(this, orca, x, y, ':', true)

  this.name = 'midi'
  this.info = 'Sends Midi a midi note.'

  this.ports.input.channel = { x: 1, y: 0 }
  this.ports.input.octave = { x: 2, y: 0 }
  this.ports.input.note = { x: 3, y: 0 }
  this.ports.haste.velocity = { x: 4, y: 0 }
  this.ports.haste.length = { x: 5, y: 0 }

  this.run = function () {
    if (!this.bang()) { return }

    this.draw = false

    const notes = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']
    // 0 - 16
    const channel = clamp(this.listen(this.ports.input.channel, true), 0, 15)
    // 2 - 9
    const octave = clamp(this.listen(this.ports.input.octave, true), 2, 9)
    // 0 - 11
    const note = notes.indexOf(this.listen(this.ports.input.note))
    // 0 - 127
    const velocity = convertVelocity(this.listen(this.ports.haste.velocity, true), 127)
    // 0 - 16
    const length = clamp(this.listen(this.ports.haste.length, true), 1, 16)

    terminal.midi.send(channel, octave, note, velocity, length)
  }

  function convertVelocity (val, max) {
    return parseInt((!val ? 1 : val < 10 ? (val / 9) : (val - 10) / 25) * max)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnMidi
