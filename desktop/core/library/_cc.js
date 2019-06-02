'use strict'

import Operator from '../operator.js'

export default function OperatorCC (orca, x, y) {
  Operator.call(this, orca, x, y, '!', true)

  this.name = 'cc'
  this.info = 'Sends MIDI control change'

  this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 15 } }
  this.ports.knob = { x: 2, y: 0, clamp: { min: 0 } }
  this.ports.value = { x: 3, y: 0, clamp: { min: 0 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }
    if (this.listen(this.ports.channel) === '.') { return }
    if (this.listen(this.ports.knob) === '.') { return }

    const channel = this.listen(this.ports.channel, true)
    const knob = this.listen(this.ports.knob, true)
    const rawValue = this.listen(this.ports.value, true)
    const value = Math.ceil((127 * rawValue) / 35)

    this.draw = false
    terminal.io.cc.send(channel, knob, value)

    if (force === true) {
      terminal.io.cc.run()
    }
  }
}
