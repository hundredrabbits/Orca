'use strict'

const Program_Default = require('./default')

function program_A (program,x, y) {
  Program_Default.call(this,program, x, y)

  this.name = 'add'
  this.glyph = 'a'
  this.ports = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.left() || !this.right()) {
      program.remove(this.x, this.y + 1)
      return
    }

    const left = !this.left() ? '0' : this.left().glyph
    const right = !this.right() ? '0' : this.right().glyph

    const index = (this.convert(left) + this.convert(right)) % program.glyphs.length
    const output = program.glyphs[index]

    program.add(this.x, this.y + 1, output)
  }

  this.convert = function (glyph) {
    return program.glyphs.indexOf(glyph)
  }
}

module.exports = program_A