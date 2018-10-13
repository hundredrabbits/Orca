'use strict'

const Program_Default = require('./default')

function program_D (program,x, y) {
  Program_Default.call(this,program, x, y)

  this.name = 'down'
  this.glyph = 'd'

  this.operation = function () {
    if (this.is_free(0, 1) != true) { this.replace('b'); this.lock(); return }
    this.move(0, 1)
  }
}

module.exports = program_D