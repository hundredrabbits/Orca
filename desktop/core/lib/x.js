'use strict'

const FnBase = require('./_base')

function FnX (pico, x, y, passive) {
  FnBase.call(this, pico, x, y, 'x', passive)

  this.name = 'split'
  this.info = 'Bangs eastward when westward fn is 0, and southward when fn is 1.'

  this.ports.input.val = { x: 1, y: 0 }

  this.operation = function () {
    const val = this.listen(this.ports.input.val)
    this.output(val === '1' ? '1' : '0')
  }
}

module.exports = FnX
