'use strict'

const Program_Default = require('./default')

function program_S (program,x, y) {
  Program_Default.call(this,program, x, y)

  this.name = 'shift'
  this.glyph = 's'
  this.ports = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }]

  this.operation = function () {
    if (this.up() && this.up().glyph != 'u') {
      program.add(this.x, this.y - 1, 'u')
      program.lock(this.x, this.y - 1)
    }
    if (this.down() && this.down().glyph != 'd') {
      program.add(this.x, this.y + 1, 'd')
      program.lock(this.x, this.y + 1)
    }
    if (this.left() && this.left().glyph != 'l') {
      program.add(this.x - 1, this.y, 'l')
      program.lock(this.x - 1, this.y)
    }
    if (this.right() && this.right().glyph != 'r') {
      program.add(this.x + 1, this.y, 'r')
      program.lock(this.x + 1, this.y)
    }
  }
}

module.exports = program_S