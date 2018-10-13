'use strict'

const FnBase = require('./_base')

function FnQ (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'even'
  this.glyph = 'q'
  this.info = 'Transforms into `O`, when a _fn_ is present northward, and **bangs** southward.'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.bang()) { return }

    this.replace('o')
    this.lock()
    pico.add(this.x, this.y + 1, 'b')
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnQ
