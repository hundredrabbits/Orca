'use strict'

const Fn = require('../fn')

function FnE (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'e', passive)

  this.name = 'east'
  this.info = 'Moves eastward, or bangs.'
  this.draw = false

  this.haste = function () {
    this.move(1, 0)
    this.passive = false
  }
}

module.exports = FnE
