'use strict'

const FnBase = require('./_base')

function FnQ (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'q', isPassive)

  this.name = 'values'
  this.info = 'Count the number of fns present eastwardly.'

  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.output = true

  this.haste = function () {
    this.len = clamp(this.listen(this.ports.haste.len, true), 1, 16)

    for (let x = 1; x <= this.len; x++) {
      pico.lock(this.x + x, this.y)
    }
  }

  this.operation = function () {
    let count = 0
    for (let x = 1; x <= this.len; x++) {
      if (pico.glyphAt(this.x + x, this.y) !== '.') { count++ }
    }
    this.output(`${pico.allowed[count]}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnQ
