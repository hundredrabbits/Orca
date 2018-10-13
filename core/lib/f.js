'use strict'

const FnBase = require('./_base')

function FnF (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'if'
  this.glyph = 'f'
  this.info = 'Bangs if east and west _fns_ are equal, southward.'
  this.ports = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.left() || !this.right()) { return }

    if (this.left(this.right().glyph)) {
      pico.add(this.x, this.y + 1, '1')
    } else {
      pico.add(this.x, this.y + 1, '0')
    }
  }
}

module.exports = FnF
