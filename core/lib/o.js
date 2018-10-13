'use strict'

const FnBase = require('./_base')

function FnO (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'odd'
  this.glyph = 'o'
  this.info = 'Transforms into `Q` when a _fn_ is present northward.'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: -1 }]

  this.operation = function () {
    if (!this.bang()) { return }

    this.replace('q')
    this.lock()
  }
}

module.exports = FnO
