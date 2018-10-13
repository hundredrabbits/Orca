'use strict'

const FnBase = require('./_base')

function FnZ (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'creep'
  this.glyph = 'z'
  this.info = 'Moves to a the next available location in a cycle of `R`,`D`,`L`,`U` based on the *runtime frame*.'

  this.operation = function () {
    const positions = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }]
    const position = positions[pico.f % 4]

    if (this.is_free(position.x, position.y) == true) {
      this.move(position.x, position.y)
    }
  }
}

module.exports = FnZ
