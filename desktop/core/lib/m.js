'use strict'

const FnBase = require('./_base')

function FnM (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'm', passive)

  this.name = 'modulo'
  this.info = 'Creates the result of the modulo operation of east and west fns, southward.'

  this.ports.input.val = { x: 1, y: 0 }
  this.ports.input.mod = { x: 2, y: 0 }
  this.ports.output = true

  this.operation = function () {
    const val = this.listen(this.ports.input.val, true)
    const mod = this.listen(this.ports.input.mod, true)
    const key = val % (mod !== 0 ? mod : 1)
    const res = pico.allowed[key] ? pico.allowed[key] : 0
    this.output(`${res}`)
  }
}

module.exports = FnM
