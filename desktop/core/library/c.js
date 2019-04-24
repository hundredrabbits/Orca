'use strict'

const Operator = require('../operator')

function OperatorC (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'c', passive)

  this.name = 'clock'
  this.info = 'Outputs a constant value based on the runtime frame.'

  this.ports.haste.rate = { x: -1, y: 0 }
  this.ports.input.mod = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const rate = this.listen(this.ports.haste.rate, true, 1)
    const mod = this.listen(this.ports.input.mod, true)
    const val = (Math.floor(orca.f / rate) % (mod || 8))
    const res = orca.keyOf(val)
    this.output(`${res}`, false, true)
  }
}

module.exports = OperatorC
