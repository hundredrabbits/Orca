'use strict'

const FnBase = require('./_base')

function FnT (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'u', isPassive)

  this.name = 'track'
  this.info = 'Read character at position.'

  this.ports.input.val = { x: 1, y: 0 }
  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.haste.key = { x: -2, y: 0 }
  this.ports.output = true

  this.haste = function () {
    this.len = clamp(this.listen(this.ports.haste.len, true), 1, 24)
    this.key = this.listen(this.ports.haste.key, true)
    for (let x = 1; x <= this.len; x++) {
      pico.lock(this.x + x, this.y)
    }
  }

  this.operation = function () {
    const pos = (this.key % this.len) + this.ports.input.val.x
    const res = pico.glyphAt(this.x + pos, this.y)
    this.output(`${res}`)
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

module.exports = FnT
