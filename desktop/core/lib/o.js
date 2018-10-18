'use strict'

const FnBase = require('./_base')

function FnO (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.name = 'odd'
  this.glyph = 'o'
  this.info = '[FIX]Adds 0 southward, transforms into Q on bang.'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: -1 }]

  this.operation = function () {
    if (this.bang()) {
      this.replace('q')
    }
    pico.add(this.x, this.y + 1, '0')
  }
}

module.exports = FnO
