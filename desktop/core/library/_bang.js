'use strict'

const Fn = require('../fn')

function FnBang (orca, x, y, passive) {
  Fn.call(this, orca, x, y, '*', true)

  this.name = 'bang'
  this.info = 'Bangs neighboring fns.'
  this.draw = false

  this.haste = function () {
    this.passive = true
    this.erase()
  }
}

module.exports = FnBang
