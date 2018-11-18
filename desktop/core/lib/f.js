'use strict'

const FnBase = require('./_base')

function FnF (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'f', isPassive)

  this.name = 'if'
  this.info = 'Outputs 1 if inputs are equal, otherwise 0.'

  this.ports.input.a = { x: 1, y: 0 }
  this.ports.input.b = { x: 2, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function () {
    const a = this.listen(this.ports.input.a, true)
    const b = this.listen(this.ports.input.b, true)
    const res = a === b ? '1' : '0'
    this.output(`${res}`)
  }
}

module.exports = FnF
