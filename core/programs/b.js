'use strict'

const Program_Default = require('./default')

function program_B (program, x, y) {
  Program_Default.call(this, program, x, y)

  this.name = 'bang'
  this.glyph = 'b'

  this.operation = function () {
    this.remove()
  }
}

module.exports = program_B
