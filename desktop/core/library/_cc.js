'use strict'

const Operator = require('../operator')

function OperatorCC (orca, x, y) {
  Operator.call(this, orca, x, y, '^', true)

  this.name = 'Midi CC'
  this.info = 'Sends a MIDI control change message.'

  this.ports.haste.channel = { x: 1, y: 0 }
  this.ports.haste.value = { x: 2, y: 0 }

  this.run = function (force = false) {
    if (!this.bang() && force === false) { return }

    const channel = this.listen(this.ports.haste.channel, true)
    const rawValue = this.listen(this.ports.haste.value, true)
    const val = Math.ceil((127 * rawValue) / 35)

    terminal.io.cc.send(channel, val)

    if (force === true) {
      terminal.io.cc.run()
    }
  }
}

module.exports = OperatorCC
