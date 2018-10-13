'use strict'

const Program_Default = require('./default')

function program_N (program,x, y) {
  Program_Default.call(this,program, x, y)

  this.name = 'turn'
  this.glyph = 'n'
  this.ports = [{ x: 0, y: 1, output: true }]

  this.operation = function () {
    program.add(this.x, this.y + 1, (program.f % 10) + '')
  }
}

module.exports = program_N