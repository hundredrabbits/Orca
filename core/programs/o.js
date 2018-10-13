'use strict'

const Program_Default = require('./default')

function program_O (program, x, y) {
  Program_Default.call(this, program, x, y)

  this.name = 'odd'
  this.glyph = 'o'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: -1 }]

  this.operation = function () {
    if (!this.bang()) { return }

    this.replace('q')
    this.lock()
  }
}

module.exports = program_O
