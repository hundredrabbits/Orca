'use strict'

const Fn = require('../fn')

function FnNull (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, '.', isPassive)

  this.name = 'null'
  this.info = 'void'
}

module.exports = FnNull
