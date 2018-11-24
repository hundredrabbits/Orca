'use strict'

const Fn = require('../fn')

function FnN (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'n', passive)

  this.name = 'north'
  this.info = 'Moves Northward, or bangs.'
  this.draw = false

  this.haste = function () {
    this.move(0, -1)
    this.passive = false
  }
}

module.exports = FnN
