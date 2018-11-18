'use strict'

const FnBase = require('./_base')

function FnI (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'i', isPassive)

  this.name = 'increment'
  this.info = 'Increments southward fn.'

  this.ports.input.min = { x: 1, y: 0 }
  this.ports.input.max = { x: 2, y: 0 }
  this.ports.input.mod = { x: 0, y: 1 }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function () {
    const min = this.listen(this.ports.input.min, true)
    const max = this.listen(this.ports.input.max, true)
    const mod = this.listen(this.ports.input.mod, true)
    const key = mod + 1 >= (max || 10) ? min : mod + 1
    const res = pico.allowed[key] ? pico.allowed[key] : 0
    this.output(`${res}`)
  }
}

module.exports = FnI
