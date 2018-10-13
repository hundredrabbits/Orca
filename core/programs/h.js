'use strict'

const ProgramDefault = require('./default')

function ProgramH (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'halt'
  this.glyph = 'h'

  this.ports = [{ x: 0, y: 1, output: true }]

  this.operation = function () {
    program.lock(this.x, this.y + 1)
  }
}

module.exports = ProgramH
