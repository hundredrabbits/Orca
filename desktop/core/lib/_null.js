'use strict'

const Fn = require('../fn')

function FnNull (pico, x, y, passive) {
  Fn.call(this, pico, x, y, '.', passive)

  this.name = 'null'
  this.info = 'void'
}

module.exports = FnNull
