'use strict'

const Fn = require('../fn')

function FnX (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'x', passive)

  this.name = 'teleport'
  this.info = 'Outputs value at offset.'

  this.ports.haste.x = { x: -2, y: 0 }
  this.ports.haste.y = { x: -1, y: 0 }
  this.ports.input.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    const x = clamp(this.listen(this.ports.haste.x, true), 0, 16)
    const y = clamp(this.listen(this.ports.haste.y, true), 1, 16)
    this.ports.output = { x: x, y: y }
  }

  this.run = function () {
    const res = this.listen(this.ports.input.val)
    this.output(`${res}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnX
