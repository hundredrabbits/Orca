'use strict'

const FnBase = require('./_base')

function FnL (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'idle'
  this.glyph = 'l'
  this.info = '[todo]Nothing.'

  this.operation = function () {

  }
}

module.exports = FnL
