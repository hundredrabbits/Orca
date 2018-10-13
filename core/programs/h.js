'use strict'

const Program_Default = require('./default')

function program_H (program, x, y) {
  Program_Default.call(this, program, x, y)

  this.name = 'halt'
  this.glyph = 'h'

  this.ports = [{ x: 0, y: 1, output: true }]

  this.operation = function () {
    program.lock(this.x, this.y + 1)
  }
}

module.exports = program_H
