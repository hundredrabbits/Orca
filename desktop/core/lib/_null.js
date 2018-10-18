'use strict'

const FnBase = require('./_base')

function FnNull (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, '.', passive)

  this.name = 'null'
  this.info = 'void'
}

module.exports = FnNull
