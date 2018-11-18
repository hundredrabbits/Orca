'use strict'

const FnBase = require('./_base')

function FnA (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'a', isPassive)

  this.name = 'add'
  this.info = 'Outputs the values of inputs.'

  this.ports.input.a = { x: 1, y: 0 }
  this.ports.input.b = { x: 2, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.operation = function () {
    const a = this.listen(this.ports.input.a, true)
    const b = this.listen(this.ports.input.b, true)
    const res = this.toChar(a + b)
    this.output(`${res}`)
  }
}

module.exports = FnA
