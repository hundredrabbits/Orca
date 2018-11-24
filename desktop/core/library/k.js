'use strict'

const Fn = require('../fn')

function FnK (orca, x, y, passive) {
  Fn.call(this, orca, x, y, 'k', passive)

  this.name = 'kill'
  this.info = 'Kills southward fn.'

  this.run = function () {
    orca.erase(this.x, this.y + 1)
  }
}

module.exports = FnK
