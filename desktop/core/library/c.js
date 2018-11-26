'use strict'

const Fn = require('../fn')

function FnC (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'c', passive)

  this.name = 'clock'
  this.info = 'Outputs a constant value based on the runtime frame.'

  this.ports.haste.ratio = { x: -1, y: 0 }
  this.ports.input.mod = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const mod = this.listen(this.ports.input.mod, true)
    const ratio = clamp(this.listen(this.ports.haste.ratio, true), 1, 16)
    const val = ((orca.f / ratio) % (mod || 10))
    const res = orca.keyOf(val)
    this.output(`${res}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnC
