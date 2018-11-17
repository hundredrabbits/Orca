'use strict'

const FnBase = require('./_base')

function FnNull (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, '.', isPassive)

  this.name = 'null'
  this.info = 'void'
}

module.exports = FnNull
