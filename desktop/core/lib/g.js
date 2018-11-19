'use strict'

const Fn = require('../fn')

function FnG (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 'g', isPassive)

  this.name = 'generator'
  this.info = 'Outputs `S` on bang.'

  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    pico.unlock(this.x, this.y + 1)
  }

  this.run = function () {
    const bang = this.bang()
    if (!bang) { return }
    this.output('S')
  }
}

module.exports = FnG
