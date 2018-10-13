'use strict'

const Program_Default = require('./default')

function program_G (program,x, y) {
  Program_Default.call(this,program, x, y)

  this.name = 'generator'
  this.glyph = 'g'

  this.ports = [{ x: 0, y: 1, output: true }, { x: 0, y: 0, bang: true }]

  this.operation = function () {
    if (!this.bang()) { return }

    program.add(this.x, this.y + 1, 'd')
  }
}

module.exports = program_G