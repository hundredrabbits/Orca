'use strict'

const ProgramDefault = require('./default')

function ProgramO (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'odd'
  this.glyph = 'o'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: -1 }]

  this.operation = function () {
    if (!this.bang()) { return }

    this.replace('q')
    this.lock()
  }
}

module.exports = ProgramO
