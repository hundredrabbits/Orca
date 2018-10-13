'use strict'

const Program_Default = require('./default')

function program_J (program,x, y) {
  Program_Default.call(this,program, x, y)

  this.name = 'jump'
  this.glyph = 'j'

  this.ports = [{ x: -1, y: 0 }, { x: 1, y: 0, output: true }, { x: 0, y: 0, bang: true }]

  this.operation = function () {
    if (!this.bang()) { return }

    if (this.left()) {
      program.add(this.x + 1, this.y, this.left().glyph)
      program.remove(this.x - 1, this.y)
      program.lock(this.x - 1, this.y)
      program.lock(this.x + 1, this.y)
    } else if (this.right()) {
      program.add(this.x - 1, this.y, this.right().glyph)
      program.remove(this.x + 1, this.y)
      program.lock(this.x - 1, this.y)
      program.lock(this.x + 1, this.y)
    }
  }
}

module.exports = program_J