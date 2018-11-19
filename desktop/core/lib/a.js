'use strict'

const Fn = require('../fn')

function FnA (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 'a', isPassive)

  this.name = 'add'
  this.info = 'Outputs the sum of inputs.'

  this.ports.input.a = { x: 1, y: 0 }
  this.ports.input.b = { x: 2, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const a = this.listen(this.ports.input.a, true)
    const b = this.listen(this.ports.input.b, true)
    const key = a + b
    const res = pico.allowed[key] ? pico.allowed[key] : 0
    this.output(`${res}`)
  }
}

module.exports = FnA
