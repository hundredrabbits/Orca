'use strict'

const FnBase = require('./_base')

function FnComment (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, ';', true)

  this.name = 'comment'
  this.info = 'Block Comment'

  this.haste = function () {
    let count = 0
    for (let x = 0; x <= this.x - 1; x++) {
      if (pico.glyphAt(x, this.y) === ';') { count++ }
    }

    this.isPassive = false

    if (count % 2 !== 0) { return }

    for (let x = this.x + 1; x <= pico.w; x++) {
      if (pico.glyphAt(x, this.y) === ';') { break }
      pico.lock(x, this.y)
    }
  }
}

module.exports = FnComment
