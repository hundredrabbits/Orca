'use strict'

const FnBase = require('./_base')

function FnG (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.type = 'transport'
  this.name = 'generator'
  this.glyph = 'g'
  this.info = 'Generates a direction fn from bang.'
  this.ports = [{ x: 0, y: 0, bang: true }]

  this.operation = function () {
    const origin = this.bang()
    if (!origin) { return }
    const vector = { x: this.x - origin.x, y: this.y - origin.y }
    const beam = { x: this.x + vector.x, y: this.y + vector.y }
    pico.add(beam.x, beam.y, vector.x === 1 ? 'e' : vector.x === -1 ? 'w' : vector.y === -1 ? 'n' : 's')
  }
}

module.exports = FnG
