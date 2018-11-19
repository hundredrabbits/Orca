'use strict'

const Fn = require('../fn')

function FnBang (pico, x, y, passive) {
  Fn.call(this, pico, x, y, '*', true)

  this.name = 'bang'
  this.info = 'Bangs!'
  this.draw = false

  this.haste = function () {
    this.passive = true
    this.remove()
  }
}

module.exports = FnBang
