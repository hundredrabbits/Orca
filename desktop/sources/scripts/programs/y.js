'use strict'

function program_Y (x, y) {
  Program_Default.call(this, x, y)

  this.name = 'automata'
  this.glyph = 'y'
  this.ports = [{ x: -1, y: 0, input: true }, { x: 1, y: 0, input: true }, { x: 0, y: 1, output: true }]

  this.operation = function () {
    if (!this.left() && !this.right()) {
      pico.program.add(this.x, this.y + 1, '1')
    } else if ((this.left() && !this.right()) || (this.right() && !this.left())) {
      pico.program.add(this.x, this.y + 1, '0')
    } else if ((this.left() && !this.right()) || (this.right() && !this.left())) {
      pico.program.add(this.x, this.y + 1, '0')
    } else if (is_num(this.left().glyph) == is_num(this.right().glyph)) {
      pico.program.add(this.x, this.y + 1, '1')
    } else {
      pico.program.add(this.x, this.y + 1, '0')
    }
  }

  function is_num (c) {
    return pico.program.glyphs.indexOf(c) < 10
  }
}
