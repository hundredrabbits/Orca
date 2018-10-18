'use strict'

const FnBase = require('./_base')

function FnZ (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'z', passive)

  this.name = 'creep'
  this.info = 'Moves to a the next available location in a cycle of E, S, W, N based on the runtime frame.'

  this.haste = function () {
    const positions = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }]
    const position = positions[pico.f % 4]

    if (this.is_free(position.x, position.y) === true) {
      this.move(position.x, position.y)
    }
  }
}

module.exports = FnZ
