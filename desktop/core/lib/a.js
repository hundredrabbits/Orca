'use strict'

const FnBase = require('./_base')

function FnA (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'a', passive)

  this.name = 'add'
  this.info = 'Creates the result of the addition of east and west fns, southward.'

  this.ports.input.a = { x: 1, y: 0 }
  this.ports.input.b = { x: 2, y: 0 }
  this.ports.output = true

  this.operation = function () {
    const a = this.listen(this.ports.input.a, true)
    const b = this.listen(this.ports.input.b, true)
    const res = this.toChar(a + b)
    this.output(`${res}`)
  }
}

module.exports = FnA
