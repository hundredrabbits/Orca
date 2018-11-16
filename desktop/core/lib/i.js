'use strict'

const FnBase = require('./_base')

function FnI (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'i', passive)

  this.name = 'increment'
  this.info = 'Increments southward numeric fn on bang.'

  this.ports.inputs.min = { x: 1, y: 0 }
  this.ports.inputs.max = { x: 2, y: 0 }
  this.ports.inputs.mod = { x: 0, y: 1 }

  this.operation = function () {
    const min = this.listen(this.ports.inputs.min, true)
    const max = this.listen(this.ports.inputs.max, true)
    const mod = this.listen(this.ports.inputs.mod, true)
    const key = mod + 1 >= (max || 9) ? min : mod + 1
    const res = pico.allowed[key] ? pico.allowed[key] : 0
    this.output(`${res}`)
  }
}

module.exports = FnI
