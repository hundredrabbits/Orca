'use strict'

import Operator from '../operator.js'

export default function OperatorMidiProgCh (orca, x, y) {
  Operator.call(this, orca, x, y, '§', true)

  this.name = 'midiprogch'
  this.info = 'Sends MIDI program change'

  this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 15 } }
  this.ports.value = { x: 2, y: 0, clamp: { min: 0 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }
    if (this.listen(this.ports.channel) === '.') { return }

    const channel = this.listen(this.ports.channel, true)
    const rawValue = this.listen(this.ports.value, true)
    const value = Math.ceil((127 * rawValue) / 35)

    this.draw = false
    terminal.io.midiprogch.send(channel, value)

    if (force === true) {
      terminal.io.midiprogch.run()
    }
  }
}
