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
    const mod = this.listen(this.ports.input.mod, true)
    const rate = this.listen(this.ports.haste.rate, true, 1)
    const val = (Math.floor(orca.f) % ((mod || 10) * rate))
    const res = val === 1 || mod === 1 ? '*' : '.'
    this.output(`${res}`)
  }
}

module.exports = OperatorD
