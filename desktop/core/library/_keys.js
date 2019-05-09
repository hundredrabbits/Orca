'use strict'

import Operator from '../operator.js'

const OCTAVE = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']

export default function OperatorKeys (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ':', true)

  this.name = 'mono'
  this.info = 'Receive MIDI note.'

  this.ports.output = { x: 0, y: 1 }

  this.operation = function (force = false) {
    if (!terminal.io.midi.key) { return '.' }
    const octave = Math.floor(terminal.io.midi.key / 12)
    const value = terminal.io.midi.key % 12
    const note = OCTAVE[value]
    const transposed = this.transpose(note, octave)
    return transposed && transposed.real ? transposed.real : '.'
  }
}
