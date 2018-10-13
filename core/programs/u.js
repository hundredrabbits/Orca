'use strict'

const ProgramDefault = require('./default')

function ProgramU (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'up'
  this.glyph = 'u'

  this.operation = function () {
    if (this.is_free(0, -1) != true) { this.replace('b'); this.lock(); return }
    this.move(0, -1)
  }
}

module.exports = ProgramU
