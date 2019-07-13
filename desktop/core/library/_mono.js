'use strict'

import Operator from '../operator.js'

export default function OperatorMono (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '%', true)

  this.name = 'mono'
  this.info = 'Sends MIDI monophonic note'
  this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 16 } }
  this.ports.octave = { x: 2, y: 0, default: '3', clamp: { min: 0, max: 8 } }
  this.ports.note = { x: 3, y: 0, default: 'C' }
  this.ports.velocity = { x: 4, y: 0, default: 'f', clamp: { min: 0, max: 16 } }
  this.ports.length = { x: 5, y: 0, default: '1', clamp: { min: 0, max: 16 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }
    if (this.listen(this.ports.channel) === '.') { return }
    if (!isNaN(this.listen(this.ports.note))) { return }

    const channel = this.listen(this.ports.channel, true)
    const octave = this.listen(this.ports.octave, true)
    const note = this.listen(this.ports.note)
    const velocity = this.listen(this.ports.velocity, true)
    const length = this.listen(this.ports.length, true)

    terminal.io.mono.send(channel, octave, note, velocity, length)

    if (force === true) {
      terminal.io.mono.run()
    }

    this.draw = false
  }
}
