'use strict'

const FnBase = require('./_base')

function FnU (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'idle'
  this.glyph = 'u'
  this.info = '[TODO]Nothing..'

  this.operation = function () {
  }
}

module.exports = FnU
