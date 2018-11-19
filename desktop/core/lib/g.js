'use strict'

const Fn = require('../fn')

function FnG (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'g', passive)

  this.name = 'generator'
  this.info = 'Outputs a value on bang.'

  this.ports.input.val = { x: 1, y: 0 }
  this.ports.output = { x: 0, y: 1, unlock: true }

  this.run = function () {
    if (!this.bang()) { return }
    const val = this.listen(this.ports.input.val)
    this.output(val)
  }
}

module.exports = FnG
