'use strict'

const Fn = require('../fn')

function FnH (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'h', passive)

  this.name = 'halt'
  this.info = 'Stops southward fn from operating.'

  this.ports.output = { x: 0, y: 1 }

  this.haste = function () {
    orca.lock(this.x, this.y + 1)
  }
}

module.exports = FnH
