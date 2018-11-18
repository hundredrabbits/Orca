'use strict'

const FnBase = require('./_base')

function FnG (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'g', isPassive)

  this.name = 'generator'
  this.info = 'Generates a S fn southward, on bang.'

  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    pico.unlock(this.x, this.y + 1)
  }

  this.operation = function () {
    const bang = this.bang()
    if (!bang) { return }
    this.output('S')
  }
}

module.exports = FnG
