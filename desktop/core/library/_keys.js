'use strict'

const Operator = require('../operator')
const OCTAVE = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B']

function OperatorKeys (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ':', true)

  this.name = 'mono'
  this.info = 'Receive MIDI note.'

  this.ports.output = { x: 0, y: 1 }

  this.operation = function (force = false) {
    const octave = Math.floor(terminal.io.midi.key / 12)
    const note = terminal.io.midi.key % 12
    return terminal.io.midi.key ? OCTAVE[note] : '.'
  }
}

module.exports = OperatorKeys
