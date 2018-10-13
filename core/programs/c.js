'use strict'

const Program_Default = require('./default')
function program_C (program, x, y) {
  Program_Default.call(this, program, x, y)

  this.name = 'clone'
  this.glyph = 'c'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 1, y: 0, output: true }, { x: -1, y: 0 }]

  this.operation = function () {
    if (this.bang() && this.left()) {
      program.add(this.x + 1, this.y, this.left().glyph)
    }
  }
}

module.exports = program_C
