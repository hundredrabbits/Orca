'use strict'

const FnBase = require('./_base')

function FnR (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'r', passive)

  this.type = 'transport'
  this.name = 'raycast'
  this.info = 'Sends a bang to the nearest fn following the direction of the bang.'

  this.operation = function () {
    const origin = this.bang()
    if (!origin) { return }
    const vector = { x: this.x - origin.x, y: this.y - origin.y }
    let beam = { x: this.x, y: this.y }
    let prev = beam
    while (pico.inBounds(beam.x, beam.y)) {
      beam = { x: beam.x + vector.x, y: beam.y + vector.y }
      const busy = pico.glyphAt(beam.x, beam.y) !== '.' && pico.glyphAt(beam.x, beam.y) !== '*'
      const outside = !pico.inBounds(beam.x, beam.y)
      if (busy || outside) {
        pico.add(prev.x, prev.y, '*')
        break
      }
      prev = beam
    }
  }
}

module.exports = FnR
