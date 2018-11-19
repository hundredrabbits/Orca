'use strict'

const Fn = require('../fn')

function FnBang (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, '*', true)

  this.name = 'bang'
  this.info = 'Bangs!'

  this.haste = function () {
    this.isPassive = true
    this.remove()
  }
}

module.exports = FnBang
