'use strict'

const Fn = require('../fn')

function FnC (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'c', passive)

  this.name = 'clock'
  this.info = 'Outputs a constant value based on the runtime frame.'

  this.ports.input.min = { x: 1, y: 0 }
  this.ports.input.max = { x: 2, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.run = function () {
    const min = this.listen(this.ports.input.min, true)
    const max = this.listen(this.ports.input.max, true)
    const key = (pico.f % (max || 10)) + min
    const res = pico.allowed[key] ? pico.allowed[key] : 0
    this.output(`${res}`)
  }
}

module.exports = FnC
