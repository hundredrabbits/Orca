'use strict'

const Operator = require('../operator')

function OperatorZ (orca, x, y, passive) {
  Operator.call(this, orca, x, y, 'z', passive)

  this.name = 'zoom'
  this.info = 'Moves eastwardly, respawns west on collision.'
  this.draw = false

  this.haste = function () {
    if (orca.glyphAt(this.x + 1, this.y) === '.') { this.move(1, 0); return }
    for (var x = this.x; x >= 0; x--) {
      const g = orca.glyphAt(x - 1, this.y)
      if (g === '.' && x !== 0) { continue }
      orca.write(x, this.y, 'Z')
      this.explode()
      break
    }
  }
}

module.exports = OperatorZ
