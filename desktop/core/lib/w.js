'use strict'

const Fn = require('../fn')

function FnW (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'w', passive)

  this.name = 'west'
  this.info = 'Moves westward, or bangs.'
  this.draw = false

  this.haste = function () {
    this.move(-1, 0)
    this.passive = false
  }
}

module.exports = FnW
