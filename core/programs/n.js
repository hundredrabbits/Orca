'use strict'

const ProgramDefault = require('./default')

function ProgramN (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'turn'
  this.glyph = 'n'
  this.ports = [{ x: 0, y: 1, output: true }]

  this.operation = function () {
    program.add(this.x, this.y + 1, (program.f % 10) + '')
  }
}

module.exports = ProgramN
