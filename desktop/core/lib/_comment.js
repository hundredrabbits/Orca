'use strict'

const Fn = require('../fn')

function FnComment (orca, x, y, passive) {
  Fn.call(this, orca, x, y, '#', true)

  this.name = 'comment'
  this.info = 'Comment a line.'
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

module.exports = FnComment
