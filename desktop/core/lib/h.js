'use strict'

const FnBase = require('./_base')

function FnH (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'h', isPassive)

  this.name = 'halt'
  this.info = 'Stops southward fn from operating.'

  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnH
