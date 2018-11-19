'use strict'

const Fn = require('../fn')

function FnW (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 'w', isPassive)

  this.name = 'west'
  this.info = 'Moves westward, or bangs.'

  this.haste = function () {
    if (this.isFree(-1, 0) !== true) { this.explode(); return }
    this.move(-1, 0)
    this.isPassive = false
  }
}

module.exports = FnW
