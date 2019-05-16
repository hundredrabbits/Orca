'use strict'

import Operator from '../operator.js'

export default function OperatorComment (orca, x, y, passive) {
  Operator.call(this, orca, x, y, '#', true)

  this.name = 'comment'
  this.info = 'Halts line'
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
