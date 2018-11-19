'use strict'

const Fn = require('../fn')

function FnH (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'h', passive)

  this.name = 'halt'
  this.info = 'Stops southward fn from operating.'

  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    pico.lock(this.x, this.y + 1)
  }
}

module.exports = FnH
