'use strict'

import Operator from '../operator.js'

export default function OperatorKeys (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '&', true)

  this.name = 'keys'
  this.info = 'Receive MIDI note'

  this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 16 }, default: '0' }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function (force = false) {
    const channel = this.listen(this.ports.channel, true)

    const id = terminal.io.midi.keys[channel]

    if (force === true) {
      terminal.io.mono.run()
    }
    this.draw = false

    return id ? terminal.io.midi.convert(id) : '.'
  }
}
