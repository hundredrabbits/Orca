'use strict'

const Fn = require('../fn')

function FnK (pico, x, y, passive) {
  Fn.call(this, pico, x, y, 'k', passive)

  this.name = 'kill'
  this.info = 'Kills southward fn.'

  this.run = function () {
    pico.remove(this.x, this.y + 1)
  }
}

module.exports = FnK
