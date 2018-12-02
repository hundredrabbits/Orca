'use strict'

const Operator = require('../operator')

function OperatorD (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'd', passive)

  this.name = 'delay'
  this.info = 'Bangs on a fraction of the runtime frame.'

  this.ports.haste.rate = { x: -1, y: 0 }
  this.ports.input.offset = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const offset = this.listen(this.ports.input.offset, true)
    const rate = clamp(this.listen(this.ports.haste.rate, true), 2, 16)
    const res = (orca.f + offset) % rate === 0 ? '*' : '.'
    this.output(`${res}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorD
