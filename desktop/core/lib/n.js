'use strict'

const Fn = require('../fn')

function FnN (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 'n', isPassive)

  this.name = 'north'
  this.info = 'Moves Northward, or bangs.'

  this.haste = function () {
    if (this.isFree(0, -1) !== true) { this.explode(); return }
    this.move(0, -1)
    this.isPassive = false
  }
}

module.exports = FnN
