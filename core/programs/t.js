'use strict'

const ProgramDefault = require('./default')

function ProgramT (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'trigger'
  this.glyph = 't'
  this.ports = [{ x: -1, y: 0 }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (this.left('1') || this.left('r') || this.left('l') || this.left('u') || this.left('d') || this.left('b') || this.left('z')) {
      this.fire()
    }
  }

  this.fire = function () {
    program.add(this.x, this.y + 1, 'b')
    program.lock(this.x, this.y + 1)
  }
}

module.exports = ProgramT
