'use strict'

const ProgramDefault = require('./default')

function ProgramL (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'left'
  this.glyph = 'l'

  this.operation = function () {
    if (this.is_free(-1, 0) != true) { this.replace('b'); this.lock(); return }
    this.move(-1, 0)
  }
}

module.exports = ProgramL
