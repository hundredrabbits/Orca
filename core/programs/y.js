'use strict'

const Program_Default = require('./default')

function program_Y (program, x, y) {
  Program_Default.call(this, program, x, y)

  this.name = 'automata'
  this.glyph = 'y'
  this.ports = [{ x: -1, y: 0, input: true }, { x: 1, y: 0, input: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.left() && !this.right()) {
      program.add(this.x, this.y + 1, '1')
    } else if ((this.left() && !this.right()) || (this.right() && !this.left())) {
      program.add(this.x, this.y + 1, '0')
    } else if ((this.left() && !this.right()) || (this.right() && !this.left())) {
      program.add(this.x, this.y + 1, '0')
    } else if (is_num(this.left().glyph) == is_num(this.right().glyph)) {
      program.add(this.x, this.y + 1, '1')
    } else {
      program.add(this.x, this.y + 1, '0')
    }
  }

  function is_num (c) {
    return program.glyphs.indexOf(c) < 10
  }
}

module.exports = program_Y
