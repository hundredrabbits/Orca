'use strict'

const Operator = require('../operator')

function OperatorComment (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '#', true)

  this.name = 'comment'
  this.info = 'Comments a line, or characters until the next hash.'
  this.draw = false

  this.haste = function () {
    for (let x = this.x + 1; x <= orca.w; x++) {
      orca.lock(x, this.y)
      if (orca.glyphAt(x, this.y) === this.glyph) { break }
    }
    this.passive = false
    orca.lock(this.x, this.y)
  }
}

module.exports = OperatorComment
