'use strict'

const Operator = require('../operator')

function OperatorOsc (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '=', true)

  this.name = 'osc'
  this.info = 'Sends a OSC message.'

  this.ports.haste.pathlen = { x: -2, y: 0 }
  this.ports.haste.msglen = { x: -1, y: 0 }

  this.haste = function () {
    this.pathlen = clamp(this.listen(this.ports.haste.pathlen, true), 0, 16)
    this.msglen = clamp(this.listen(this.ports.haste.msglen, true), 0, 16)
    for (let x = 1; x <= this.pathlen + this.msglen; x++) {
      orca.lock(this.x + x, this.y)
    }
  }

  this.run = function () {
    if (!this.bang()) { return }

    this.draw = false

    let path = ''
    for (let x = 0; x < this.pathlen; x++) {
      path += orca.glyphAt(1 + this.x + x, this.y)
    }

    let msg = ''
    for (let x = this.pathlen; x < this.pathlen + this.msglen; x++) {
      msg += orca.glyphAt(1 + this.x + x, this.y)
    }

    terminal.io.osc.send(path, msg)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorOsc
