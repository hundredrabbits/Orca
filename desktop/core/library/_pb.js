'use strict'

import Operator from '../operator.js'

export default function OperatorPB (orca, x, y) {
  Operator.call(this, orca, x, y, '?', true)

  this.name = 'cc'
  this.info = 'Sends MIDI pitch bend'
  this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 15 } }
  this.ports.value = { x: 3, y: 0, clamp: { min: 0 } }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }
    if (this.listen(this.ports.channel) === '.') { return }
    if (this.listen(this.ports.value) === '.') { return }

    const channel = this.listen(this.ports.channel, true)
    const rawValue = this.listen(this.ports.value, true)
    const value = Math.ceil((127 * rawValue) / 35)

    terminal.io.cc.stack.push({ channel, value, type: 'pb' })

    this.draw = false

    if (force === true) {
      terminal.io.cc.run()
    }
  }
}
