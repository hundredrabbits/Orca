'use strict'

const ProgramDefault = require('./default')

function ProgramZ (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'creep'
  this.glyph = 'z'

  this.operation = function () {
    const positions = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }]
    const position = positions[program.f % 4]

    if (this.is_free(position.x, position.y) == true) {
      this.move(position.x, position.y)
    }
  }
}

module.exports = ProgramZ
