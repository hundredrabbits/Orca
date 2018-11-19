'use strict'

const Fn = require('../fn')

function FnE (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'e', passive)

  this.name = 'east'
  this.info = 'Moves eastward, or bangs.'
  this.draw = false

  this.haste = function () {
    this.move(1, 0)
    this.passive = false
  }
}

module.exports = FnE
