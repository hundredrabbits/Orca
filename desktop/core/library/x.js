'use strict'

const Operator = require('../operator')

function OperatorX (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'x', true)

  this.name = 'teleport'
  this.info = 'Writes a distant operator with offset.'

  this.ports.haste.x = { x: -2, y: 0 }
  this.ports.haste.y = { x: -1, y: 0 }
  this.ports.input.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, unlock: true }

  this.haste = function () {
    const x = clamp(this.listen(this.ports.haste.x, true), 0, 24)
    const y = clamp(this.listen(this.ports.haste.y, true), 1, 24)
    this.ports.output = { x: x, y: y, unlock: true }
  }

  this.run = function () {
    if (!this.bang() && !passive) { return }
    const res = this.listen(this.ports.input.val)
    this.output(`${res}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = OperatorX
