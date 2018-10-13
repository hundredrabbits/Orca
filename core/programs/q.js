'use strict'

const ProgramDefault = require('./default')

function ProgramQ (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'even'
  this.glyph = 'q'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.bang()) { return }

    this.replace('o')
    this.lock()
    program.add(this.x, this.y + 1, 'b')
    program.lock(this.x, this.y + 1)
  }
}

module.exports = ProgramQ
