'use strict'

const Operator = require('../operator')

function OperatorComment (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '#', true)

  this.name = 'comment'
  this.info = 'Comments a line, or characters until the next hash.'
  this.draw = false

  this.haste = function () {
    let count = 0
    for (let x = 0; x <= this.x - 1; x++) {
      if (orca.glyphAt(x, this.y) === this.glyph) { count++ }
    }

    this.passive = false

    if (count % 2 !== 0) { return }

    for (let x = this.x + 1; x <= orca.w; x++) {
      if (orca.glyphAt(x, this.y) === this.glyph) { break }
      orca.lock(x, this.y)
    }
  }
}

module.exports = OperatorComment
