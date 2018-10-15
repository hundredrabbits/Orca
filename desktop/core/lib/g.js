'use strict'

const FnBase = require('./_base')

function FnG (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'generator'
  this.glyph = 'g'
  this.info = 'Generates a direction fn from bang.'

  this.ports = [{ x: 0, y: 1, output: true }, { x: 0, y: 0, bang: true }]

  this.operation = function () {
    if (!this.bang()) { return }

    pico.add(this.x, this.y + 1, 's')
  }
}

module.exports = FnG
