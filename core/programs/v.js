'use strict'

const Program_Default = require('./default')

function program_V (program, x, y) {
  Program_Default.call(this, program, x, y)

  this.name = 'value'
  this.glyph = 'v'
  this.ports = [{ x: -1, y: 0 }, { x: -2, y: 0 }, { x: -3, y: 0 }, { x: -4, y: 0 }, { x: -5, y: 0 }]

  this.operation = function () {
    const val = (program.glyph_at(this.x - 1, this.y) != '.' ? 1 : 0) + (program.glyph_at(this.x - 2, this.y) != '.' ? 1 : 0) + (program.glyph_at(this.x - 3, this.y) != '.' ? 1 : 0) + (program.glyph_at(this.x - 4, this.y) != '.' ? 1 : 0) + (program.glyph_at(this.x - 5, this.y) != '.' ? 1 : 0)

    program.add(this.x + 1, this.y, val + '')
    program.lock(this.x + 1, this.y)
  }
}

module.exports = program_V
