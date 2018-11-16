'use strict'

const FnBase = require('./_base')

function FnC (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'c', passive)

  this.name = 'clock'
  this.info = 'Adds a constant value southward.'

  this.ports.inputs.min = { x: 1, y: 0 }
  this.ports.inputs.max = { x: 2, y: 0 }

  this.operation = function () {
    const min = this.listen(this.ports.inputs.min, true)
    const max = this.listen(this.ports.inputs.max, true)
    const key = (pico.f % max) + min
    const res = pico.allowed[key] ? pico.allowed[key] : 0
    this.output(`${res}`)
  }
}

module.exports = FnC
