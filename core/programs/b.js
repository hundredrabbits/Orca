'use strict'

const ProgramDefault = require('./default')

function ProgramB (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'bang'
  this.glyph = 'b'

  this.operation = function () {
    this.remove()
  }
}

module.exports = ProgramB
