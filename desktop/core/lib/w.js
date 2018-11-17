'use strict'

const FnBase = require('./_base')

function FnW (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'w', isPassive)

  this.name = 'west'
  this.info = 'Moves westward, or bangs.'

  this.haste = function () {
    if (this.isFree(-1, 0) !== true) { this.replace('*'); this.lock(); return }
    this.move(-1, 0)
    this.isPassive = false
  }
}

module.exports = FnW
