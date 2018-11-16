'use strict'

const FnBase = require('./_base')

function FnF (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'f', passive)

  this.name = 'if'
  this.info = 'Bangs if east and west fns are equal, southward.'

  this.ports.inputs.a = { x: 1, y: 0 }
  this.ports.inputs.b = { x: 2, y: 0 }

  this.operation = function () {
    const a = this.listen(this.ports.inputs.a, true)
    const b = this.listen(this.ports.inputs.b, true)
    const res = a === b ? '1' : '0'
    this.output(`${res}`)
  }
}

module.exports = FnF
