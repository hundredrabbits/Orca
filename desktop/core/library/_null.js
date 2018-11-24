'use strict'

const Fn = require('../fn')

function FnNull (orca, x, y, passive) {
  Fn.call(this, orca, x, y, '.', passive)

  this.name = 'null'
  this.info = 'empty'
}

module.exports = FnNull
