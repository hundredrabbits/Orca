'use strict'

const Operator = require('../operator')

function OperatorI (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'i', passive)

  this.name = 'increment'
  this.info = 'Increments southward operator.'

  this.ports.haste.step = { x: -1, y: 0, default: 1 }
  this.ports.input.mod = { x: 1, y: 0, default: 36 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const step = this.listen(this.ports.haste.step, true, 0, 36)
    const mod = this.listen(this.ports.input.mod, true, 0, 36)
    const val = this.listen(this.ports.output, true)
    const res = orca.keyOf((val + step) % mod)
    this.output(`${res}`, false, true)
  }
}

module.exports = OperatorI
