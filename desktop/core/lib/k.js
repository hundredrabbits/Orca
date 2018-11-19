'use strict'

const Fn = require('../fn')

function FnK (pico, x, y, isPassive) {
  Fn.call(this, pico, x, y, 'k', isPassive)

  this.name = 'kill'
  this.info = 'Kills southward fn.'

  this.run = function () {
    pico.remove(this.x, this.y + 1)
  }
}

module.exports = FnK
