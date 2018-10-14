'use strict'

const FnBase = require('./_base')

function FnR (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'idle'
  this.glyph = 'r'
  this.info = '[TODO]Nothing..'

  this.operation = function () {

  }
}

module.exports = FnR
