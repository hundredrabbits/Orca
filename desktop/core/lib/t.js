'use strict'

const FnBase = require('./_base')

function FnT (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'u', passive)

  this.name = 'track'
  this.info = 'Read character at position.'

  this.ports.haste.len = { x: -1, y: 0 }
  this.ports.haste.key = { x: -2, y: 0 }

  this.haste = function () {
    this.len = this.listen(this.ports.haste.len, true)
    this.key = this.listen(this.ports.haste.len, true)

    for (let x = 1; x <= this.len; x++) {
      pico.lock(this.x + x, this.y)
    }
  }

  this.operation = function () {
    if (!this.len || this.len < 1 || this.key < 0) { return }
    const x = (this.x + 1) + (this.key % this.len)
    const index = pico.glyphAt(x, this.y)
    pico.add(this.x, this.y + 1, index)
  }
}

module.exports = FnT
