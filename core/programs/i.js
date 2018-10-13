'use strict'

const ProgramDefault = require('./default')

function ProgramI (program, x, y) {
  ProgramDefault.call(this, program, x, y)

  this.name = 'increment'
  this.glyph = 'i'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.bang()) { return }
    if (!this.down()) { return }

    const n = this.down()
    program.add(this.x, this.y + 1, this.inc(n.glyph))
  }

  this.inc = function (letter) {
    if (parseInt(letter) == 9) { return '0' }
    if (parseInt(letter) == 0) { return '1' }
    if (parseInt(letter) > 0) { return parseInt(letter) + 1 + '' }

    const index = program.glyphs.indexOf(letter)

    if (index < 0) { return }

    return program.glyphs[(index + 1) % program.glyphs.length]
  }
}

module.exports = ProgramI
