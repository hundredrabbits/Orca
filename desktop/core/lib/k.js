'use strict'

const FnBase = require('./_base')

function FnK (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.type = 'trigger'
  this.name = 'kill'
  this.glyph = 'k'
  this.info = 'Kills southward fns, on bang.'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.bang()) { return }
    pico.remove(this.x, this.y + 1)
  }
}

module.exports = FnK
