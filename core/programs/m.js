'use strict'

const Program_Default = require('./default')

function program_M (program,x, y) {
  Program_Default.call(this,program, x, y)

  this.name = 'modulo'
  this.glyph = 'm'
  this.ports = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.left() || !this.right()) { return }

    const val = program.glyphs.indexOf(this.left().glyph)
    const mod = program.glyphs.indexOf(this.right().glyph)

    if (mod == 0) { return }

    program.add(this.x, this.y + 1, `${parseInt(val) % parseInt(mod)}`)
  }
}

module.exports = program_M