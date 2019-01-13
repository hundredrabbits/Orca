'use strict'

const Operator = require('../operator')

function OperatorOsc (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ';', true)

  this.name = 'osc'
  this.info = 'Sends a configured OSC message.'

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

    terminal.io.osc.send(msg)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorOsc
