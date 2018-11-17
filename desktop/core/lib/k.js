'use strict'

const FnBase = require('./_base')
// TODO
function FnK (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'k', isPassive)

  this.name = 'kill'
  this.info = 'Kills southward fns, on bang.'

  this.operation = function () {
    pico.remove(this.x, this.y + 1)
  }
}

module.exports = FnK
