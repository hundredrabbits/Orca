'use strict'

const FnBase = require('./_base')

function FnH (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'h', passive)

  this.name = 'halt'
  this.info = 'Stops southward fn from operating.'
  // this.ports.push({ x: 0, y: 1, output: true })

  this.haste = function () {
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnH
