'use strict'

const Operator = require('../operator')

function OperatorCC (orca, x, y) {
  Operator.call(this, orca, x, y, '^', true)

  this.name = 'Midi CC'
  this.info = 'Sends a MIDI control change message.'

  this.ports.input.channel = { x: 1, y: 0 }
  this.ports.input.knob = { x: 2, y: 0 }
  this.ports.input.value = { x: 3, y: 0 }

  this.run = function (force = false) {
    if (!this.bang() && force === false) { return }

    const channel = this.listen(this.ports.input.channel, true)
    const knob = this.listen(this.ports.input.knob, true)
    const rawValue = this.listen(this.ports.input.value, true)
    const val = Math.ceil((127 * rawValue) / 35)

    terminal.io.cc.send(channel, knob, val)

    if (force === true) {
      terminal.io.cc.run()
    }
  }
}

module.exports = OperatorCC
