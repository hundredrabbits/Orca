'use strict'

import Operator from '../operator.js'

export default function OperatorMidi (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ':', true)

  this.name = 'midi'
  this.info = 'Sends MIDI note'

  this.ports.input.channel = { x: 1, y: 0, clamp: { min: 0, max: 16 } }
  this.ports.input.octave = { x: 2, y: 0, clamp: { min: 0, max: 8 } }
  this.ports.input.note = { x: 3, y: 0 }
  this.ports.input.velocity = { x: 4, y: 0, default: 'f', clamp: { min: 0, max: 16 } }
  this.ports.input.length = { x: 5, y: 0, default: '1', clamp: { min: 0, max: 16 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }

    if (this.listen(this.ports.input.channel) === '.') { return }
    if (this.listen(this.ports.input.octave) === '.') { return }
    if (this.listen(this.ports.input.note) === '.') { return }

    const channel = this.listen(this.ports.input.channel, true)
    const rawOctave = this.listen(this.ports.input.octave, true)
    const rawNote = this.listen(this.ports.input.note)
    const rawVelocity = this.listen(this.ports.input.velocity, true)
    const length = this.listen(this.ports.input.length, true)

    if (!isNaN(rawNote)) { return }

    const transposed = this.transpose(rawNote, rawOctave)
    // 1 - 8
    const octave = transposed.octave
    // 0 - 11
    const note = transposed.value
    // 0 - G(127)
    const velocity = parseInt((rawVelocity / 16) * 127)

    this.draw = false

    terminal.io.midi.send(channel, octave, note, velocity, length)

    if (force === true) {
      terminal.io.midi.run()
    }
  }
}
