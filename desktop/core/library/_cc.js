'use strict'

import Operator from '../operator.js'

export default function OperatorCC (orca, x, y) {
  Operator.call(this, orca, x, y, '!', true)

  this.name = 'cc'
  this.info = 'Sends MIDI cc/program change/pitchbend'
  this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 15 } }
  this.ports.data1 = { x: 2, y: 0, clamp: { min: 0 } }
  this.ports.data2 = { x: 3, y: 0, clamp: { min: 0 } }
  this.ports.type = { x: 4, y: 0, clamp: { min: 0, max: 15 }, default: '0' }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }
    if (this.listen(this.ports.channel) === '.') { return }
    if (this.listen(this.ports.data1) === '.') { return }
    if (this.listen(this.ports.data2) === '.') { return }

    const channel = this.listen(this.ports.channel, true)
    const data1 = this.listen(this.ports.data1, true)
    const data2 = this.listen(this.ports.data2, true)
    const type = this.listen(this.ports.type, true)

    if (type === 2) {
      terminal.io.cc.send(channel, Math.ceil((127 * data1) / 35), Math.ceil((127 * data2) / 35), type)
    } else {
      terminal.io.cc.send(channel, data1, Math.ceil((127 * data2) / 35), type)
    }

    this.draw = false

    if (force === true) {
      terminal.io.cc.run()
    }
  }
}
