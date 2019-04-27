'use strict'

const Operator = require('../operator')

function OperatorI (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'i', passive)

  this.name = 'increment'
  this.info = 'Increments southward operator.'

  this.ports.haste.rate = { x: -1, y: 0 }
  this.ports.input.mod = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const rate = this.listen(this.ports.haste.rate, true, 0, 36, 1)
    const mod = this.listen(this.ports.input.mod, true, 0, 36, 36)
    const val = this.listen(this.ports.output, true)
    const res = orca.keyOf((val + rate) % mod)
    this.output(`${res}`, false, true)
  }
}

module.exports = OperatorI
