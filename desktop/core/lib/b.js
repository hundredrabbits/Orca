'use strict'

const FnBase = require('./_base')

function FnB (pico, x, y, isPassive) {
  FnBase.call(this, pico, x, y, 'b', isPassive)

  this.name = 'banger'
  this.info = 'Bangs southward in the presence of `1`, `N`, `S`, `W`, `E` or `Z` northward.'

  this.ports.input.val = { x: 1, y: 0 }
  this.ports.output = true

  this.operation = function () {
    const val = this.listen(this.ports.input.val)
    const chr = ['1', 'w', 's', 'n', 'e', '*']
    const res = chr.indexOf(val.toLowerCase()) > -1 ? '*' : '.'
    this.output(`${res}`)
  }
}

module.exports = FnB
