'use strict'

const Program_Default = require('./default')

function program_L (program,x, y) {
  Program_Default.call(this,program, x, y)

  this.name = 'left'
  this.glyph = 'l'

  this.operation = function () {
    if (this.is_free(-1, 0) != true) { this.replace('b'); this.lock(); return }
    this.move(-1, 0)
  }
}

module.exports = program_L