'use strict'

const Fn = require('../fn')

function FnK (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'k', passive)

  this.name = 'kill'
  this.info = 'Kills southward fn.'
  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    this.output('.')
  }
}

module.exports = FnK
