'use strict'

function program_K (x, y) {
  Program_Default.call(this, x, y)

  this.name = 'kill'
  this.glyph = 'k'
  this.ports = [{ x: 0, y: 0, bang: true }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }]

  this.operation = function () {
    if (this.bang()) {
      pico.program.remove(this.x - 1, this.y)
      pico.program.remove(this.x + 1, this.y)
      pico.program.remove(this.x, this.y + 1)
      pico.program.remove(this.x, this.y - 1)

      pico.program.lock(this.x, this.y + 1)
      pico.program.lock(this.x, this.y - 1)
      pico.program.lock(this.x + 1, this.y)
      pico.program.lock(this.x - 1, this.y)
    }
  }
}
