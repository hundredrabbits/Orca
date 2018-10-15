'use strict'

const FnBase = require('./_base')

function FnR (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'raycast'
  this.glyph = 'r'
  this.info = 'Sends a bang to the nearest fn following the direction of the bang.'

  this.operation = function () {
    const origin = this.bang()
    if (!origin) { return }
    const vector = { x: this.x - origin.x, y: this.y - origin.y }
    let beam = { x: this.x, y: this.y }
    let prev = beam
    while (pico.inBounds(beam.x, beam.y)) {
      beam = { x: beam.x + vector.x, y: beam.y + vector.y }
      if (pico.glyphAt(beam.x, beam.y) !== '.' || !pico.inBounds(beam.x, beam.y)) {
        pico.add(prev.x, prev.y, 'b')
        break
      }
      prev = beam
    }
  }
}

module.exports = FnR
