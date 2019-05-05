'use strict'

const Operator = require('../operator')

function OperatorUdp (orca, x, y, passive) {
  Operator.call(this, orca, x, y, ';', true)

  this.name = 'udp'
  this.info = 'Sends a UDP message.'

  this.haste = function () {
    for (let x = 1; x <= 36; x++) {
      const g = orca.glyphAt(this.x + x, this.y)
      if (g === '.') { break }
      orca.lock(this.x + x, this.y)
    }
  }

  this.operation = function (force = false) {
    if (!this.hasNeighbor('*') && force === false) { return }

    let msg = ''
    for (let x = 1; x <= 36; x++) {
      const g = orca.glyphAt(this.x + x, this.y)
      if (g === '.') { break }
      msg += g
    }

    if (msg === '') { return }

    this.draw = false
    terminal.io.udp.send(msg)

    if (force === true) {
      terminal.io.udp.run()
    }
  }
}

module.exports = OperatorUdp
