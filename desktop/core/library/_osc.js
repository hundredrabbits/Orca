'use strict'

const Operator = require('../operator')

function OperatorOsc (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '=', true)

  this.name = 'osc'
  this.info = 'Sends a OSC message.'

  this.ports.haste.pathlen = { x: -2, y: 0 }
  this.ports.haste.msglen = { x: -1, y: 0 }

  this.haste = function () {
    this.pathlen = this.listen(this.ports.haste.pathlen, true)
    this.msglen = this.listen(this.ports.haste.msglen, true)
    for (let x = 1; x <= this.pathlen + this.msglen; x++) {
      orca.lock(this.x + x, this.y)
    }
  }

  this.run = function () {
    if (!this.bang()) { return }

    let path = ''
    for (let x = 0; x < this.pathlen; x++) {
      path += orca.glyphAt(1 + this.x + x, this.y)
    }

    if (path === '') { return }

    this.draw = false

    let msg = ''
    for (let x = this.pathlen; x < this.pathlen + this.msglen; x++) {
      msg += orca.glyphAt(1 + this.x + x, this.y)
    }

    terminal.io.osc.send(path, msg)
  }
}

module.exports = OperatorOsc
