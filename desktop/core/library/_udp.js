'use strict'

const Operator = require('../operator')

function OperatorUdp (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ';', true)

  this.name = 'udp'
  this.info = 'Sends a UDP message.'

  this.haste = function () {
    this.msg = ''
    for (let x = 1; x <= 36; x++) {
      const g = orca.glyphAt(this.x + x, this.y)
      if (g === '.') { break }
      orca.lock(this.x + x, this.y)
      this.msg += g
    }
  }

  this.run = function (force = false) {
    if (!this.bang() && force === false) { return }
    if (this.msg === '') { return }
    this.draw = false
    terminal.io.udp.send(this.msg)
  }
}

module.exports = OperatorUdp
