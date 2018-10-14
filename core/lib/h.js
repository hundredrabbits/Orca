'use strict'

const FnBase = require('./_base')

function FnH (pico, x, y) {
  FnBase.call(this, pico, x, y)

  this.name = 'halt'
  this.glyph = 'h'
  this.info = 'Stops southward fn from operating.'

  this.ports = [{ x: 0, y: 1, output: true }]

  this.operation = function () {
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnH
