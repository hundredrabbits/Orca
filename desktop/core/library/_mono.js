'use strict'

import Operator from '../operator.js'

export default function OperatorMono (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '%', true)

  this.name = 'mono'
  this.info = 'Sends MIDI monophonic note'

  this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 16 } }
  this.ports.octave = { x: 2, y: 0, clamp: { min: 0, max: 8 } }
  this.ports.note = { x: 3, y: 0 }
  this.ports.velocity = { x: 4, y: 0, default: 'f', clamp: { min: 0, max: 16 } }
  this.ports.length = { x: 5, y: 0, default: '1', clamp: { min: 0, max: 16 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }

    if (this.listen(this.ports.channel) === '.') { return }
    if (this.listen(this.ports.octave) === '.') { return }
    if (this.listen(this.ports.note) === '.') { return }

    const channel = this.listen(this.ports.channel, true)
    const rawOctave = this.listen(this.ports.octave, true)
    const rawNote = this.listen(this.ports.note)
    const rawVelocity = this.listen(this.ports.velocity, true)
    const length = this.listen(this.ports.length, true)

    if (!isNaN(rawNote)) { return }

    const transposed = this.transpose(rawNote, rawOctave)
    // 1 - 8
    const octave = transposed.octave
    // 0 - 11
    const note = transposed.value
    // 0 - G(127)
    const velocity = parseInt((rawVelocity / 16) * 127)

    this.draw = false

    terminal.io.mono.send(channel, octave, note, velocity, length)

    if (force === true) {
      terminal.io.mono.run()
    }
  }
}
