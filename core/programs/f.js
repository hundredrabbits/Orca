'use strict'

const Program_Default = require('./default')

function program_F (program, x, y) {
  Program_Default.call(this, program, x, y)

  this.name = 'if'
  this.glyph = 'f'
  this.ports = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.left() || !this.right()) { return }

    if (this.left(this.right().glyph)) {
      program.add(this.x, this.y + 1, '1')
    } else {
      program.add(this.x, this.y + 1, '0')
    }
  }
}

module.exports = program_F
