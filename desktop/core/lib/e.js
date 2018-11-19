'use strict'

const Fn = require('../fn')

function FnE (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 'e', isPassive)

  this.name = 'east'
  this.info = 'Moves eastward, or bangs.'

  this.haste = function () {
    if (this.isFree(1, 0) !== true) { this.explode(); return }
    this.move(1, 0)
    this.isPassive = false
  }
}

module.exports = FnE
