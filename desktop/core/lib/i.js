'use strict'

const FnBase = require('./_base')

function FnI (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'i', passive)

  this.name = 'increment'
  this.info = 'Increments southward numeric fn on bang.'

  this.ports.input.min = { x: 1, y: 0 }
  this.ports.input.max = { x: 2, y: 0 }
  this.ports.input.mod = { x: 0, y: 1 }
  this.ports.output = true

  this.operation = function () {
    const min = this.listen(this.ports.input.min, true)
    const max = this.listen(this.ports.input.max, true)
    const mod = this.listen(this.ports.input.mod, true)
    const key = mod + 1 >= (max || 9) ? min : mod + 1
    const res = pico.allowed[key] ? pico.allowed[key] : 0
    this.output(`${res}`)
  }
}

module.exports = FnI
