'use strict'

const ProgramDefault = require('./default')

function ProgramK (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'kill'
  this.glyph = 'k'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }]

  this.operation = function () {
    if (this.bang()) {
      program.remove(this.x - 1, this.y)
      program.remove(this.x + 1, this.y)
      program.remove(this.x, this.y + 1)
      program.remove(this.x, this.y - 1)

      program.lock(this.x, this.y + 1)
      program.lock(this.x, this.y - 1)
      program.lock(this.x + 1, this.y)
      program.lock(this.x - 1, this.y)
    }
  }
}

module.exports = ProgramK
