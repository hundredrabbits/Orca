'use strict'

const FnBase = require('./_base')

function FnN (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'n', passive)

  this.type = 'direction'
  this.name = 'north'
  this.info = 'Moves Northward, or bangs.'

  this.haste = function () {
    if (this.isFree(0, -1) !== true) { this.replace('*'); this.lock(); return }
    this.move(0, -1)
  }
}

module.exports = FnN
