'use strict'

const Operator = require('../operator')

function OperatorI (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'i', passive)

  this.name = 'increment'
  this.info = 'Increments southward operator.'

  this.ports.haste.min = { x: -1, y: 0 }
  this.ports.input.max = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const min = this.listen(this.ports.haste.min, true)
    const max = this.listen(this.ports.input.max, true)
    const val = this.listen(this.ports.output, true)
    if (min === max) { return }
    const next = val + (min < max ? 1 : -1)
    const _min = min < max ? min : max
    const _max = min > max ? min : max
    const res = next >= _max ? _min : next < _min ? _max - 1 : next
    this.output(`${orca.keyOf(res)}`, false, true)
  }
}

module.exports = OperatorI
