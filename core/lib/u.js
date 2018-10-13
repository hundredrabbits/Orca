'use strict'

const FnBase = require('./_base')

function FnU (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'up'
  this.glyph = 'u'
  this.info = 'Moves Northward.'

  this.operation = function () {
    if (this.is_free(0, -1) != true) { this.replace('b'); this.lock(); return }
    this.move(0, -1)
  }
}

module.exports = FnU
