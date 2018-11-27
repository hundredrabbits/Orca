'use strict'

const Operator = require('../operator')

function OperatorMidi (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ';', true)

  this.name = 'udp'
  this.info = 'Sends a string via UDP to localhost.'

  this.ports.haste.len = { x: -1, y: 0 }

  this.haste = function () {
    this.len = clamp(this.listen(this.ports.haste.len, true), 1, 16)
    for (let x = 1; x <= this.len; x++) {
      orca.lock(this.x + x, this.y)
    }
  }

  this.run = function () {
    if (!this.bang()) { return }

    this.draw = false

    let msg = ''
    for (let x = 0; x < this.len; x++) {
      msg += orca.glyphAt(1 + this.x + x, this.y)
    }

    terminal.io.sendUdp(msg)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorMidi
