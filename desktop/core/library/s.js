'use strict'

const Fn = require('../fn')

function FnS (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 's', passive)

  this.name = 'south'
  this.info = 'Moves southward, or bangs.'
  this.draw = false

  this.haste = function () {
    this.move(0, 1)
    this.passive = false
  }
}

module.exports = FnS
