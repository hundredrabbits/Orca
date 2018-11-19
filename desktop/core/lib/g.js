'use strict'

const Fn = require('../fn')

function FnG (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'g', passive)

  this.name = 'generator'
  this.info = 'Outputs `S` on bang.'

  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    pico.unlock(this.x, this.y + 1)
  }

  this.run = function () {
    if (!this.bang()) { return }
    this.output('S')
  }
}

module.exports = FnG
