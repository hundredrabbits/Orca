'use strict'

const ProgramDefault = require('./default')

function ProgramD (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'down'
  this.glyph = 'd'

  this.operation = function () {
    if (this.is_free(0, 1) != true) { this.replace('b'); this.lock(); return }
    this.move(0, 1)
  }
}

module.exports = ProgramD
