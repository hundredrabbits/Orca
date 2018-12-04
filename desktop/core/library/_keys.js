'use strict'

const Operator = require('../operator')

function OperatorKeys (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '!', true)

  this.name = 'keys'
  this.info = 'Bangs on keyboard input.'

  this.ports.haste.key = { x: -1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const key = this.listen(this.ports.haste.key)
    console.log(orca.terminal.io.stack.keys)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorKeys
