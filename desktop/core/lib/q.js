'use strict'

const Fn = require('../fn')

function FnQ (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'q', passive)

  this.name = 'count'
  this.info = 'Counts the number of fns present eastwardly.'

  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    this.len = clamp(this.listen(this.ports.haste.len, true), 1, 16)

    for (let x = 1; x <= this.len; x++) {
      pico.lock(this.x + x, this.y)
    }
  }

  this.run = function () {
    let count = 0
    for (let x = 1; x <= this.len; x++) {
      if (pico.glyphAt(this.x + x, this.y) !== '.') { count++ }
    }
    this.output(`${pico.allowed[count]}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnQ
