'use strict'

const Fn = require('../fn')

function FnZ (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'z', passive)

  this.name = 'diagonal'
  this.info = 'Moves diagonally toward south-east.'
  this.draw = false

  this.haste = function () {
    this.move(1, 1)
    this.passive = false
  }
}

module.exports = FnZ
