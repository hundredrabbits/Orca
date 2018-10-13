'use strict'

const ProgramDefault = require('./default')

function ProgramR (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'right'
  this.glyph = 'r'

  this.operation = function () {
    if (this.is_free(1, 0) != true) { this.replace('b'); this.lock(); return }
    this.move(1, 0)
  }
}

module.exports = ProgramR
