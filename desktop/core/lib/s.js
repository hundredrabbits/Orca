'use strict'

const Fn = require('../fn')

function FnS (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 's', isPassive)

  this.name = 'south'
  this.info = 'Moves southward, or bangs.'

  this.haste = function () {
    if (this.isFree(0, 1) !== true) { this.explode(); return }
    this.move(0, 1)
    this.isPassive = false
  }
}

module.exports = FnS
