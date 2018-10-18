'use strict'

const FnBase = require('./_base')
function FnC (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, passive)

  this.name = 'clamp'
  this.glyph = 'c'
  this.info = '[FIX]Clamp the northern fn between the westward and eastward fn bang.'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 1, y: 0, output: true }, { x: -1, y: 0 }]

  this.operation = function () {
    if (!this.bang() || !this.west()) { return }

    pico.add(this.x + 1, this.y, this.west().glyph)
  }
}

module.exports = FnC
