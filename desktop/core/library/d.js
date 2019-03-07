'use strict'

const Operator = require('../operator')

function OperatorD (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'd', passive)

  this.name = 'delay'
  this.info = 'Bangs on a fraction of the runtime frame.'

  this.ports.haste.rate = { x: -1, y: 0 }
  this.ports.input.mod = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const rate = this.listen(this.ports.haste.rate, true, 1)
    const mod = this.listen(this.ports.input.mod, true)
    const val = orca.f % ((mod || 10) * rate)
    const res = val === 0 || mod === 1 ? '*' : '.'
    this.output(`${res}`)
  }
}

module.exports = OperatorD
