'use strict'

const Operator = require('../operator')

function OperatorMono (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ':', true)

  this.name = 'mono'
  this.info = 'Sends MIDI note to a monophonic instrument.'

  this.ports.input.channel = { x: 1, y: 0, default: -1, clamp: { min: 0, max: 16 } }
  this.ports.input.octave = { x: 2, y: 0, default: -1, clamp: { min: 0, max: 8 } }
  this.ports.input.note = { x: 3, y: 0 }
  this.ports.input.velocity = { x: 4, y: 0, default: 16, clamp: { min: 0, max: 16 } }
  this.ports.input.length = { x: 5, y: 0, default: 1, clamp: { min: 0, max: 16 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }

    const channel = this.listen(this.ports.input.channel, true)

    if (channel === -1) { return }

    const rawOctave = this.listen(this.ports.input.octave, true)
    const rawNote = this.listen(this.ports.input.note)

    if (rawOctave === -1) { return }
    if (rawNote === '.') { return }

    const rawVelocity = this.listen(this.ports.input.velocity, true)
    const rawLength = this.listen(this.ports.input.length, true)

    const transposed = this.transpose(rawNote, rawOctave)
    // 1 - 8
    const octave = transposed.octave
    // 0 - 11
    const note = transposed.value
    // 0 - G(127)
    const velocity = parseInt((rawVelocity / 16) * 127)

    this.draw = false

    terminal.io.mono.send(channel, octave, note, velocity, length)
  }
}

module.exports = OperatorMono
