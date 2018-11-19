'use strict'

const Fn = require('../fn')

function FnN (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'n', passive)

  this.name = 'north'
  this.info = 'Moves Northward, or bangs.'

  this.haste = function () {
    this.move(0, -1)
    this.passive = false
  }
}

module.exports = FnN
