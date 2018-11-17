'use strict'

const FnBase = require('./_base')

function FnS (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 's', isPassive)

  this.name = 'south'
  this.info = 'Moves southward, or bangs.'

  this.haste = function () {
    if (this.isFree(0, 1) !== true) { this.replace('*'); return }
    this.move(0, 1)
  }
}

module.exports = FnS
